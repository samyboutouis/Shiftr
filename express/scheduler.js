const db = require('./database');
var ObjectId = require('mongodb').ObjectID;
var faker = require('faker');
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')
const tempShiftsCollection = db.get().collection('tempShifts')
const tempUsersCollection = db.get().collection('tempUsers')

async function cloneCollections(group) {
  try {
    await shiftsCollection.aggregate([{ $match: {group: group, status: "open"} }, { $out: "tempShifts" }]).toArray();
    await usersCollection.aggregate([{ $match: {group: group} }, { $sort: {rank: 1} }, { $out: "tempUsers" }]).toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.temp_shifts = async function(group) {
  try {
    // let tempShiftsCollection = db.get().collection('tempShifts');
    return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.temp_users = async function() {
  try {
    // let tempUsersCollection = db.get().collection('tempUsers');
    return await tempUsersCollection.find().toArray();
  } catch (err) {
    console.log(err);
  }
}

exports.all_shifts = async function(group) {
    try {
      // let tempUsersCollection = db.get().collection('tempUsers');
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
  exports.delete_data = async function(group) {
    try {
      shiftsCollection.deleteMany( { } );
      var start = 1607522400;
      for(var day=0; day<5; day++) {
        for(var hour=0; hour<8; hour++) {
          await shiftsCollection.insertOne({start_time: start, end_time: start+3600, group: "Code+", status: "open"});
          start+=3600;
        }
        if(day === 2){
          start = 1607954400;
        } else {
          start+=57600;
        }
      }
      usersCollection.deleteMany( { } );
    } catch (err) {
      console.log(err);
    }
  }

  exports.set_data = async function(group) {
    try {
      shiftsCollection.deleteMany( { } );
      usersCollection.deleteMany( { } );
      groups = ['Code+', 'CoLab', 'The Link']
      for(var users=0; users<100; users++) {
        var avail_array=[];
        var early = 1607947200;
        var avail=Math.floor(Math.random() * 5);
        while(avail<5) {
          var start = early + (Math.floor(Math.random() * 40) + 4)*900;
          avail_array.push({start_time: start, end_time: start + (Math.floor(Math.random() * 20) + 4)*900 });
          early+=86400;
          avail++;
        }
        await usersCollection.insertOne({
          name: faker.name.findName(), 
          netid: faker.random.uuid(), 
          // group: groups[Math.floor(Math.random() * groups.length)],
          group: "Code+",
          availability: {times: avail_array},
          rank: users
        });
      }
      var start = 1607954400;
      for(var day=0; day<5; day++) {
        for(var hour=0; hour<8; hour++) {
          await shiftsCollection.insertOne({start_time: start, end_time: start+3600, group: "Code+", status: "open"});
          await shiftsCollection.insertOne({start_time: start, end_time: start+3600, group: "CoLab", status: "open"});
          await shiftsCollection.insertOne({start_time: start, end_time: start+3600, group: "The Link", status: "open"});
          start+=3600;
        }
        start+=57600;
      }
    } catch (err) {
      console.log(err);
    }
  }

  exports.assign_shifts = async function(group) {
    const start = Date.now();
    await cloneCollections(group);
    // let tempShiftsCollection = db.get().collection('tempShifts');

    try {
      matches = await this.all_shifts(group);
      var count = 1;
      while (matches && matches.length > 0){
        let match = matches[0];
        // let user = {name: match.name, netid: match.netid};
        let user = {name: match.name, netid: match.netid, rank: match.rank};
        await splitAndAssignShifts(match, user, count);
        await updateUserAvailability(match);
        matches = await this.all_shifts(group);
        count++;
      }
      const millis = Date.now() - start;
      console.log('seconds elapsed = '+ Math.floor(millis / 1000));
      console.log('('+millis+' milliseconds)');
      return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

 async function updateUserAvailability(match) {
  // let tempUsersCollection = db.get().collection('tempUsers');
  let shift_start = match.matching_shifts[0].start_time;
  let shift_end = match.matching_shifts[0].end_time;
  let availability_start = match.availability.times.start_time;
  let availability_end = match.availability.times.end_time;

  if (availability_start < shift_start && availability_end > shift_end) {
    console.log("1");
    console.log("shift start: "+shift_start);
    console.log("shift end: "+shift_end);
    console.log("availability start: "+availability_start);
    console.log("availability end: "+availability_end);
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, {
    $push: {
    previous_availability: { "start_time": shift_start, "end_time": shift_end },
      "availability.times": { "start_time": shift_end, "end_time": availability_end }
    }
    });
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.end_time": availability_end }, { $set: { "availability.times.$.end_time": match.matching_shifts[0].start_time } });
  }
  else if (availability_start < shift_start) {
    console.log("2");
    console.log("shift start: "+shift_start);
    console.log("shift end: "+shift_end);
    console.log("availability start: "+availability_start);
    console.log("availability end: "+availability_end);
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.end_time": availability_end }, {
    $push: { previous_availability: { "start_time": shift_start, "end_time": availability_end } },
      $set: { "availability.times.$.end_time": shift_start }
    });
  }
  else if (availability_end > shift_end) {
    console.log("3");
    console.log("shift start: "+shift_start);
    console.log("shift end: "+shift_end);
    console.log("availability start: "+availability_start);
    console.log("availability end: "+availability_end);
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.start_time": availability_start }, {
    $push: { previous_availability: { "start_time": availability_start, "end_time": shift_end } },
      $set: { "availability.times.$.start_time": shift_end }
    });
  }
  else {
    console.log("4");
    console.log("shift start: "+shift_start);
    console.log("shift end: "+shift_end);
    console.log("availability start: "+availability_start);
    console.log("availability end: "+availability_end);
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, 
    { $push: { previous_availability: match.availability.times }, 
      $pull: { "availability.times": match.availability.times } });
  }
}

async function splitAndAssignShifts(match, user, count) {
  var shift_start = match.matching_shifts[0].start_time;
  var shift_end = match.matching_shifts[0].end_time;
  var availability_start = match.availability.times.start_time;
  var availability_end = match.availability.times.end_time;

  if (availability_start > shift_start && availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start });
    await splitShift(match.matching_shifts[0], { "start_time": availability_end });
    await assignShift(match, { start_time: availability_start, end_time: availability_end, employee: user, status: "scheduled "+count });
  }
  else if (availability_start > shift_start) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start });
    await assignShift(match, { start_time: availability_start, employee: user, status: "scheduled "+count });
  }
  else if (availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "start_time": availability_end });
    await assignShift(match, { end_time: availability_end, employee: user, status: "scheduled "+count });
  }
  else {
    await assignShift(match, { employee: user, status: "scheduled "+count });
  }
}

  async function splitShift(shift, time) {
    // let tempShiftsCollection = db.get().collection('tempShifts');
    let split_shift =  JSON.parse(JSON.stringify(shift));
    delete split_shift._id;
    split_shift[Object.keys(time)[0]] = Object.values(time)[0];
    await tempShiftsCollection.insertOne(split_shift);
  }

  async function assignShift(match, newValues) {
    // let tempShiftsCollection = db.get().collection('tempShifts');
    await tempShiftsCollection.updateOne(
      {"_id": ObjectId(match.matching_shifts[0]._id)}, 
      {$set: newValues}
      );
  }
    
