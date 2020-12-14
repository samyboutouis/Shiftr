const db = require('./database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')
const schedulesCollection = db.get().collection('schedules')
// const { usersCollection, shiftsCollection } = await cloneCollections();

async function cloneCollections() {
  try {
    await db.get().collection('shifts').aggregate([{ $match: {group: group, status: "open"} }, { $out: "tempShifts" }]).toArray();
    await db.get().collection('users').aggregate([{ $match: {group: group} }, { $sort: {rank: 1} }, { $out: "tempUsers" }]).toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.temp_shifts = async function(group) {
  try {
    let tempShiftsCollection = db.get().collection('tempShifts');
    return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.temp_users = async function(group) {
  try {
    let tempUsersCollection = db.get().collection('tempUsers');
    return await tempUsersCollection.find().toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.all_shifts = async function(group) {
    try {
      let tempUsersCollection = db.get().collection('tempUsers');
        return await tempUsersCollection.aggregate([
            { $unwind: { path: "$availability.times", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                "from": "tempShifts",
                "let": { "start_time": '$availability.times.start_time', "end_time": '$availability.times.end_time' },
                "pipeline": [
                    { $match: { $expr: { $and: [ 
                        { $eq: [ "$status", "open" ] },
                        { $lt: [ "$$start_time", "$end_time" ] },
                        { $gt: [ "$$end_time", "$start_time" ] } ] } } }
                ],
                "as": "matching_shifts"}},
            { $match: {matching_shifts: {$ne: []}}},
            { $project: { name: 1, netid: 1, "availability.times": 1, rank: 1, matching_shifts: 1}}
        ]).toArray();
      } catch (err) {
        console.log(err);
      }
  }

  // removes all documents from shifts and users collections
  exports.assign_shifts2 = async function(group) {
    try {
      shiftsCollection.deleteMany( { } );
      usersCollection.deleteMany( { } );
    } catch (err) {
      console.log(err);
    }
  }

  exports.assign_shifts = async function(group) {
    await cloneCollections();
    let tempShiftsCollection = db.get().collection('tempShifts');

    try {
      matches = await this.all_shifts(group);
      console.log(matches);
      while (matches && matches.length > 0){
        let match = matches[0];
        let user = {name: match.name, netid: match.netid};
        console.log(user.name);
        await splitAndAssignShifts(match, user);
        updateUserAvailability(match);
        matches = await this.all_shifts(group);
        console.log(matches);
      }
      return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

function updateUserAvailability(match) {
  let tempUsersCollection = db.get().collection('tempUsers');
  let shift_start = match.matching_shifts[0].start_time;
  let shift_end = match.matching_shifts[0].end_time;
  let availability_start = match.availability.times.start_time;
  let availability_end = match.availability.times.end_time;

  if (availability_start < shift_start && availability_end > shift_end) {
    tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, {
    $push: {
    previous_availability: { "start_time": shift_start, "end_time": shift_end },
      "availability.times": { "start_time": shift_end, "end_time": availability_end }
    }
    });
    tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.start_time": availability_start }, { $set: { "availability.times.$.end_time": match.matching_shifts[0].start_time } });
  }
  else if (availability_start < shift_start) {
    tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.start_time": availability_start }, {
    $push: { previous_availability: { "start_time": shift_start, "end_time": availability_end } },
      $set: { "availability.times.$.end_time": shift_start }
    });
  }
  else if (availability_end > shift_end) {
    tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.start_time": availability_start }, {
    $push: { previous_availability: { "start_time": availability_start, "end_time": shift_end } },
      $set: { "availability.times.$.start_time": shift_end }
    });
  }
  else {
    tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, 
    { $push: { previous_availability: match.availability.times }, 
      $pull: { "availability.times": match.availability.times } });
  }
}

async function splitAndAssignShifts(match, user) {
  var shift_start = match.matching_shifts[0].start_time;
  var shift_end = match.matching_shifts[0].end_time;
  var availability_start = match.availability.times.start_time;
  var availability_end = match.availability.times.end_time;

  if (availability_start > shift_start && availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start });
    await splitShift(match.matching_shifts[0], { "start_time": availability_end });
    assignShift(match, { start_time: availability_start, end_time: availability_end, employee: user, status: "scheduled" });
  }
  else if (availability_start > shift_start) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start });
    assignShift(match, { start_time: availability_start, employee: user, status: "scheduled" });
  }
  else if (availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "start_time": availability_end });
    assignShift(match, { end_time: availability_end, employee: user, status: "scheduled" });
  }
  else {
    assignShift(match, { employee: user, status: "scheduled" });
  }
}

  async function splitShift(shift, time) {
    let tempShiftsCollection = db.get().collection('tempShifts');
    let split_shift =  JSON.parse(JSON.stringify(shift));
    delete split_shift._id;
    split_shift[Object.keys(time)[0]] = Object.values(time)[0];
    await tempShiftsCollection.insertOne(split_shift);
  }

  function assignShift(match, newValues) {
    let tempShiftsCollection = db.get().collection('tempShifts');
    tempShiftsCollection.updateOne(
      {"_id": ObjectId(match.matching_shifts[0]._id)}, 
      {$set: newValues}
      );
  }
    
