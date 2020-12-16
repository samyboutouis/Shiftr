const db = require('./database');
var ObjectId = require('mongodb').ObjectID;
var faker = require('faker');
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')
const tempShiftsCollection = db.get().collection('tempShifts')
const tempUsersCollection = db.get().collection('tempUsers')
const schedulesCollection = db.get().collection('schedules')

// generate automated schedule for a group
exports.assign_shifts = async function(group) {
  const start = Date.now();
  await cloneCollections(group); // clone relevant shifts and users to tempShifts and tempUsers
  try {
    matches = await this.all_shifts(group); // array of user availabilities and their matching shifts
    while (matches && matches.length > 0){
      let match = matches[0]; // first availability/shift match
      let user = {name: match.name, netid: match.netid, rank: match.rank};
      await splitAndAssignShifts(match, user); // assign user to shift and split shift by time if necessary
      await updateUserAvailability(match); // add shift time to previous availability and remove/update current availability
      matches = await this.all_shifts(group); // new array of availabilities/matching shifts
    }
    const millis = Date.now() - start;
    console.log('seconds elapsed = '+ Math.floor(millis / 1000));
    console.log('('+millis+' milliseconds)'); // run time
    // return await createSchedule(group); 
    return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray(); // return tempShifts of group in time order
  } catch (err) {
    console.log(err);
  }
}

async function createSchedule(group) {
  try {
    var tempShifts = await tempShiftsCollection.aggregate([
      { $match: {group: group} }, 
      { $project: { group: 0 }}]).toArray();
    var tempUsers = await tempUsersCollection.aggregate([
      { $match: {group: group} }, 
      { $sort: {rank: 1} },
      { $project: { group: 0 }}]).toArray();
    return await schedulesCollection.insertOne({
      group: group,
      timestamp: Date.now(),
      shifts: tempShifts, 
      users: tempUsers
    });
  } catch (err) {
    console.log(err);
  }
}


// clone open shifts in specified group into tempShifts collection
// clone users in specified group into tempUsers collection (sorted by ascending rank)
async function cloneCollections(group) {
  try {
    await shiftsCollection.aggregate([{ $match: {group: group, status: "open"} }, { $out: "tempShifts" }]).toArray();
    await usersCollection.aggregate([{ $match: {group: group} }, { $sort: {rank: 1} }, { $out: "tempUsers" }]).toArray();
  } catch (err) {
    console.log(err);
  }
}

// return a list of user availabilities and their matching shifts
// format: [ {id, name, netid, availability:{times:{start_time,end_time}},rank,matching_shifts:[{id,start_time,end_time,group,status}...]}...}
// TODO: make sure tempUsersCollection is correct if this isn't called through assign_shifts
exports.all_shifts = async function(group) {
  try {
      return await tempUsersCollection.aggregate([
        // split users into different objects for each of their availability windows
          { $unwind: { path: "$availability.times", preserveNullAndEmptyArrays: true } },
          { $lookup: {
              "from": "tempShifts",
              "let": { "start_time": '$availability.times.start_time', "end_time": '$availability.times.end_time' },
              "pipeline": [
                  { $match: { $expr: { $and: [ 
                      { $eq: [ "$status", "open" ] }, // open shifts
                      { $lt: [ "$$start_time", "$end_time" ] }, // user available before shift end
                      { $gt: [ "$$end_time", "$start_time" ] } ] } } } // user available after shift start
              ],
              "as": "matching_shifts"}},
          { $match: {matching_shifts: {$ne: []}}}, // only those availabilities with matching shifts
          { $project: { name: 1, netid: 1, "availability.times": 1, rank: 1, matching_shifts: 1}}
      ]).toArray(); 
    } catch (err) {
      console.log(err);
    }
}

// assign user to shift and split shift by time if necessary
async function splitAndAssignShifts(match, user) {
  var shift_start = match.matching_shifts[0].start_time;
  var shift_end = match.matching_shifts[0].end_time;
  var availability_start = match.availability.times.start_time;
  var availability_end = match.availability.times.end_time;

  // if shift starts before and ends after user's availability
  if (availability_start > shift_start && availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start }); // create new shift before user is available
    await splitShift(match.matching_shifts[0], { "start_time": availability_end }); // create new shift after user is available
    // update shift's start and end time to match user availability, assign user to shift
    await assignShift(match, { start_time: availability_start, end_time: availability_end, employee: user, status: "scheduled " }); 
  }
  // if shift starts before the user is available
  else if (availability_start > shift_start) {
    await splitShift(match.matching_shifts[0], { "end_time": availability_start }); // create new shift before user is available
    // update shift's start time to match user availability, assign user to shift
    await assignShift(match, { start_time: availability_start, employee: user, status: "scheduled " });
  }
  // if shift ends before the user is available
  else if (availability_end < shift_end) {
    await splitShift(match.matching_shifts[0], { "start_time": availability_end }); // create new shift after user is available
    // update shift's end time to match user availability, assign user to shift
    await assignShift(match, { end_time: availability_end, employee: user, status: "scheduled " });
  }
  // if shift perfectly matches the user's availability or is in the middle of the availability
  else {
    await assignShift(match, { employee: user, status: "scheduled " }); //assign user to shift
  }
}

  // create new shift
  async function splitShift(shift, time) {
    let split_shift =  JSON.parse(JSON.stringify(shift));
    delete split_shift._id;
    split_shift[Object.keys(time)[0]] = Object.values(time)[0];
    await tempShiftsCollection.insertOne(split_shift);
  }

  // assign user to shift and update shift time if needed
  async function assignShift(match, newValues) {
    await tempShiftsCollection.updateOne(
      {"_id": ObjectId(match.matching_shifts[0]._id)}, 
      {$set: newValues}
      );
  }

  // add shift time to previous availability and remove/update current availability
 async function updateUserAvailability(match) {
  let shift_start = match.matching_shifts[0].start_time;
  let shift_end = match.matching_shifts[0].end_time;
  let availability_start = match.availability.times.start_time;
  let availability_end = match.availability.times.end_time;

  // if user is available before the shift starts and after the shift ends
  if (availability_start < shift_start && availability_end > shift_end) {
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, {
    $push: {previous_availability: { "start_time": shift_start, "end_time": shift_end }, // set previous availability to the shift time
      "availability.times": { "start_time": shift_end, "end_time": availability_end } // set current availability to user's availability after the shift
    }});
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.end_time": availability_end }, 
    { $set: { "availability.times.$.end_time": match.matching_shifts[0].start_time } }); // add to current availability: user's availability before the shift
  }
  // if user is available before the shift starts
  else if (availability_start < shift_start) {
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.end_time": availability_end }, {
    $push: { previous_availability: { "start_time": shift_start, "end_time": availability_end } }, // set previous availability to shift time they're available for
      $set: { "availability.times.$.end_time": shift_start } // set current availability to user's availabilty before the shift
    });
  }
  // if user is available after the shift ends
  else if (availability_end > shift_end) {
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id), "availability.times.start_time": availability_start }, {
    $push: { previous_availability: { "start_time": availability_start, "end_time": shift_end } }, // set previous availability to shift time they're available for
      $set: { "availability.times.$.start_time": shift_end } // set current availability to user's availabilty after the shift
    });
  }
  // if user is available during the exact shift time or in the middle of the shift
  else {
    // move this availability from current to previous availability
    await tempUsersCollection.updateOne({ "_id": ObjectId(match._id) }, 
    { $push: { previous_availability: match.availability.times },
      $pull: { "availability.times": match.availability.times } });
  }
}

// return all shifts in tempShifts belonging to group in ascending time order
exports.temp_shifts = async function(group) {
  try {
    return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
  } catch (err) {
    console.log(err);
  }
}

// return all users in tempUsers
exports.temp_users = async function() {
  try {
    return await tempUsersCollection.find().toArray();
  } catch (err) {
    console.log(err);
  }
}

  // resets shifts and users collections to test on a larger data set
  exports.set_data = async function(group) {
    try {
      // remove all documents from shifts and users collections
      shiftsCollection.deleteMany( { } );
      usersCollection.deleteMany( { } );
      groups = ['Code+', 'CoLab', 'The Link']
      for(var users=0; users<100; users++) { // create 100 new users
        var avail_array=[];
        var early = 1607947200; // earliest start time (Dec 14 2020, 7 AM eastern)
        var avail=Math.floor(Math.random() * 5);  // random number of availabilities (0-5)
        while(avail<5) { 
          var start = early + (Math.floor(Math.random() * 40) + 4)*900; // random shift start time (7AM-5PM, 15 minute interval)
          avail_array.push({start_time: start, end_time: start + (Math.floor(Math.random() * 20) + 4)*900 }); // add availability object to array. random shift length (1-6 hours, 15 minute interval)
          early+=86400; // increase earliest start time (next day at 7AM)
          avail++;
        }
        await usersCollection.insertOne({ // insert new user
          name: faker.name.findName(),
          netid: faker.random.uuid(), 
          group: groups[Math.floor(Math.random() * groups.length)], // random group (Code+, CoLab, or The Link)
          // group: "Code+",
          availability: {times: avail_array}, 
          rank: users // index of for loop
        });
      }
      var start = 1607954400;
      for(var day=0; day<5; day++) { // loop through weekday (Dec 14-18, 2020)
        for(var hour=0; hour<8; hour++) { // loop through workday (9AM-5PM eastern)
          // insert new 1 hour open shift for each group
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

  // removes all documents from shifts and users collections
  exports.delete_data = async function(group) {
    try {
      shiftsCollection.deleteMany( { } );
      // await basicTestShifts();
      usersCollection.deleteMany( { } );
    } catch (err) {
      console.log(err);
    }
  }

  // creates one hour Code+ shifts from 9AM-5PM Dec 9-11, 14-15 2020 eastern (for testing)
async function basicTestShifts() {
  var start = 1607522400;
  for (var day = 0; day < 5; day++) {
    for (var hour = 0; hour < 8; hour++) {
      await shiftsCollection.insertOne({ start_time: start, end_time: start + 3600, group: "Code+", status: "open" });
      start += 3600; // go to next hour
    }
    if (day === 2) { // friday--go to monday
      start = 1607954400;
    }
    else { // go to next weekday
      start += 57600;
    }
  }
}
    
