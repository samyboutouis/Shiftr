const db = require('./database');
var ObjectId = require('mongodb').ObjectID;
var faker = require('faker');
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')
const tempShiftsCollection = db.get().collection('tempShifts')
const tempUsersCollection = db.get().collection('tempUsers')
const schedulesCollection = db.get().collection('schedules')

// generate automated schedule for a group
exports.assign_shifts = async function(group, start_date, end_date) {
  const start = Date.now();
  await cloneCollections(group, start_date, end_date); // clone relevant shifts and users to tempShifts and tempUsers
  try {
    matches = await this.all_shifts(); // array of user availabilities and their matching shifts
    while (matches && matches.length > 0){
      let match = matches[0]; // first availability/shift match
      let user = {name: match.name, netid: match.netid, rank: match.rank};
      await splitAndAssignShifts(match, user); // assign user to shift and split shift by time if necessary
      await updateUserAvailability(match); // add shift time to previous availability and remove/update current availability
      matches = await this.all_shifts(); // new array of availabilities/matching shifts
    }
    const millis = Date.now() - start;
    console.log('seconds elapsed = '+ Math.floor(millis / 1000));
    console.log('('+millis+' milliseconds)'); // run time
    return await createSchedule(group); 
    // return await tempShiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray(); // return tempShifts of group in time order
  } catch (err) {
    console.log(err);
  }
}

// rank users in ascending order of total available hours divided by preferred hours
exports.rank_users = async function(group) {
  try {
    return await usersCollection.aggregate([
      { $match: {group: group} }, 
      { $project: 
        { "availability":1, "netid":1, "name":1, "group":1, "total_available_hours": {
          $reduce: {
            input: "$availability.times",
            initialValue: "$0",
            in: { $sum: [ "$$value", { $subtract: [ "$$this.end_time", "$$this.start_time" ] } ] } } } } }, // add up all availability windows (sum each: end time - start time)
      { $project: {"total_available_hours":1, "availability":1, "netid":1, "name":1, "group":1, 
        "rank": { $cond: [ { $eq: [ "$availability.preferred_hours", 0 ] }, "NA", // handles divide by 0: if prefers 0 hours, rank = NA
        { $divide: [ "$total_available_hours", {$multiply: [ "$availability.preferred_hours", 3600] } ] }]}}}, // rank = available/preferred hours
      { $sort: {rank: 1} }]).toArray();
  } catch (err) {
    console.log(err);
  }
}

async function createSchedule(group) {
  try {
    // get all tempShifts matching group in time order
    var tempShifts = await tempShiftsCollection.aggregate([
      { $match: {group: group} }, 
      { $sort: {"start_time":1} },
      { $project: { group: 0 }}]).toArray();
    // get all tempUsers matching group in rank order
    var tempUsers = await tempUsersCollection.aggregate([
      { $match: {group: group} }, 
      { $sort: {rank: 1} },
      { $project: { name: 1, netid: 1, availability: 1 }}]).toArray();
    // insert document in schedulesCollection
    schedule = await schedulesCollection.insertOne({
      group: group,
      timestamp: Date.now(),
      shifts: tempShifts, 
      users: tempUsers
    });
    return schedule["ops"][0];
  } catch (err) {
    console.log(err);
  }
}


// clone open shifts in specified group into tempShifts collection
// clone users in specified group into tempUsers collection (sorted by ascending rank)
async function cloneCollections(group, start_date, end_date) {
  try {
    await shiftsCollection.aggregate([
      { $match: {
        group: group, 
        start_time: {$gte: start_date}, 
        end_time: {$lte: end_date}, 
        status: "open"} 
      }, 
      { $out: "tempShifts" }
    ]).toArray();

    // await usersCollection.aggregate([ 
    //   { "$unwind" : "$availability.times" },
    //   { "$match"  : { group: group, "availability.times.start_time" : {$gte: start_date}, "availability.times.end_time": {$lte: end_date} } },
    //   { "$group"  : { 
    //     "_id" : "$_id", 
    //     "group" : { "$first" : "$group" }, 
    //     "netid": { "$first": "$netid" }, 
    //     "name": { "$first": "$name" }, 
    //     "availability": { "$first": "$availability" } } } , 
    //     { $project: 
    //       { "availability":1, "netid":1, "name":1, "group":1, "total_available_hours": {
    //         $reduce: {
    //           input: "$availability.times",
    //           initialValue: "$0",
    //           in: { $sum: [ "$$value", { $subtract: [ "$$this.end_time", "$$this.start_time" ] } ] } } } } },
    //     { $project: {"availability":1, "netid":1, "name":1, "group":1, "rank": { $cond: [ { $eq: [ "$availability.preferred_hours", 0 ] }, "NA", { $divide: [ "$total_available_hours", {$multiply: [ "$availability.preferred_hours", 3600] } ] }]}}},
    //     { $sort: {rank: 1} }, 
    //     { $out: "tempUsers" }]).toArray();

    await usersCollection.aggregate([
      { $match: {group: group} }, 
      { $project: 
        { "availability":1, "netid":1, "name":1, "group":1, "total_available_hours": {
          $reduce: {
            input: "$availability.times",
            initialValue: "$0",
            in: { $sum: [ "$$value", { $subtract: [ "$$this.end_time", "$$this.start_time" ] } ] } } } } },
      { $project: {"availability":1, "netid":1, "name":1, "group":1, "rank": { $cond: [ { $eq: [ "$availability.preferred_hours", 0 ] }, "NA", { $divide: [ "$total_available_hours", {$multiply: [ "$availability.preferred_hours", 3600] } ] }]}}},
      { $sort: {rank: 1} }, 
      { $out: "tempUsers" }]).toArray();
  } catch (err) {
    console.log(err);
  }
}

// return a list of user availabilities and their matching shifts
// format: [ {id, name, netid, availability:{times:{start_time,end_time}},rank,matching_shifts:[{id,start_time,end_time,group,status}...]}...}
// TODO: make sure tempUsersCollection is correct if this isn't called through assign_shifts
exports.all_shifts = async function() {
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
          availability: {times: avail_array, preferred_hours: Math.floor(Math.random()*10)}, 
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

  exports.edit_shift = async function(id, body) {
    try {
      await schedulesCollection.updateOne(
        {"_id": ObjectId(id)},
        { $set: { 
          "shifts.$[elem].employee.name" : body.user,
          "shifts.$[elem].status": "scheduled", 
          "shifts.$[elem].employee.netid" : body.netid, 
          "shifts.$[elem].start_time" : body.start_time, 
          "shifts.$[elem].end_time" : body.end_time 
        } 
        },
        { arrayFilters: [ { "elem._id": ObjectId(body.shift_id) } ] }
      );
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
    
// creates three weeks of completed shifts
exports.hoursTestShifts = async function() {
  var employees = [
    {name: "Anna Mollard", netid: "acm105", email: "anna.mollard@duke.edu", role: "supervisor", group: ["Code+", "CoLab"], hours: 40, location: ["Remote", "CoLab"]}, 
    {name: "Sunny Li", netid: "l616", email: "sunny.li@duke.edu", role: "employee", group: ["Code+", "CoLab"], hours: 35, location: ["Remote", "CoLab"]}, 
    {name: "Samy Boutouis", netid: "sb590", email: "samy.boutouis@duke.edu", role: "employee", group: ["Code+"], hours: 30, location: ["Remote", "CoLab"]}, 
    {name: "Ryleigh Byrne", netid: "rmb96", email: "ryleigh.byrne@duke.edu", role: "employee", group: ["Code+"], hours: 25, location: ["Remote", "CoLab"]}
  ]
  var start = 1608559200;
  for (var e = 0; e < employees.length; e++) {
    await usersCollection.insertOne({
      name: employees[e].name,
      netid: employees[e].netid,
      email: employees[e].email,
      role: employees[e].role,
      group: employees[e].group,
      availability: {preferred_hours: employees[e].hours}
    })
  }
  await usersCollection.insertOne({
    name: "Danai Adkisson",
    netid: "da129",
    email: "danai.adkisson@duke.edu",
    role: "admin",
    group: ["CoLab", "Code+", "OIT"]
  })
  for (var day = 0; day < 25; day++) {
    if(day < 15) {
      for (var e = 0; e < employees.length; e++) {
        await shiftsCollection.insertOne({ 
          employee: employees[e], 
          start_time: start, 
          clocked_in: start+(Math.floor(Math.random() * 30)-15)*60, 
          end_time: start+28800, 
          clocked_out: start+28800+(Math.floor(Math.random() * 30)-15)*60, 
          group: "Code+", 
          location: "Remote",
          status: "completed"
        });
      }
     } 
     else {
      for (var e = 0; e < employees.length; e++) {
        var first = start + (Math.floor(Math.random() * 20) + 4)*900;
        var last = first + (Math.floor(Math.random() * 10) + 4)*900;
        await usersCollection.updateOne(
          {netid: employees[e].netid}, 
          {$push: {"availability.times" : {"start_time": first, "end_time": last }}});
      }
      await shiftsCollection.insertOne({ 
        start_time: start, 
        end_time: start+28800, 
        group: "Code+", 
        location: "Remote",
        status: "open"
      });      
    }
    if((day+1)%5 === 0) {
      start += 259200;
    } else {
      start += 86400;
    }
  }
}
