const db = require('./database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')

exports.schedule = async function() {
    try {
      let openShifts = await shiftsCollection.find({"status": "open"}).toArray();
      let users = new Array();
      for (const shift of openShifts) {
        let s = shift;
        let u = await usersCollection.find({"group": shift.group, "availability.times": { $elemMatch: { start_time: { $lte: shift.start_time }, end_time: { $gte: shift.end_time } } }}).toArray();
        s.users = u;
        users.push(s);
        // users.push(await usersCollection.find({"group": shift.group, "availability.times": { $elemMatch: { start_time: { $lte: shift.start_time }, end_time: { $gte: shift.end_time } } }}).toArray());
      }
      return users;
    } catch (err) {
      console.log(err);
    }
  }

  exports.schedule2 = async function(group) {
    try {
        let users = await usersCollection.find({"group": group}).sort({"rank":1}).toArray();
        let shifts = new Array();
        for (const user of users) {
          let u = user;
          let s = await shiftsCollection.find({"group": group, "status":"open"} ).toArray();
          // let s = await shiftsCollection.find({"group": group, "start_time": { $gte: user.availability.times.start_time }, "end_time": { $lte: user.availability.times.end_time } } ).toArray();
          u.shifts = s;
          shifts.push(u);
        }
        return shifts;
      } catch (err) {
        console.log(err);
      }
  }

//   exports.schedule3 = async function(group) {
//     try {
//         return await usersCollection.aggregate([
//             { $match: {group: group} },
//             { $sort: {rank: 1} },
//             { $unwind: { path: "$availability.times", preserveNullAndEmptyArrays: true } },
//             { $lookup: {
//                 "from": "shifts",
//                 "let": { "group": "$group", "start_time": '$start_time', "end_time": '$end_time' },
//                 "pipeline": [
//                     { $match: { "group": "$$group", "status": "open", "availability.times.start_time": { $lte: "$$start_time" }, "availability.times.end_time": { $gte: "$$end_time" } } }
//                 ],
//                 "as": "matching_shifts"
//             }}
//         ]).toArray();
//       } catch (err) {
//         console.log(err);
//       }
//   }

exports.all_shifts = async function(group) {
    try {
        return await usersCollection.aggregate([
            { $match: {group: group} },
            { $sort: {rank: 1} },
            { $unwind: { path: "$availability.times", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                "from": "shifts",
                "let": { "start_time": '$availability.times.start_time', "end_time": '$availability.times.end_time' },
                "pipeline": [
                    { $match: { $expr: { $and: [ 
                        { $eq: [ "$group", group ] },
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

  exports.assign_shifts_basic = async function(group) {
    try {
      //check if full time shift, otherwise need to split
      matches = await this.all_shifts(group);
      while (matches && matches.length > 0){
        let match = matches[0];
        let user = {name: match.name, netid: match.netid};
        shiftsCollection.updateOne(
          {"_id": ObjectId(match.matching_shifts[0]._id)}, 
          {$set: {employee: user, status: "scheduled"}}
          );
        usersCollection.updateOne(
          {"_id": ObjectId(match._id)}, 
          { $push: { previous_availability: match.availability.times }, $pull: { "availability.times": match.availability.times } }, 
          );
          matches = await this.all_shifts(group);
      }
      return "hi";
    } catch (err) {
      console.log(err);
    }
  }

  exports.assign_shifts2 = async function(group) {
    try {
      //check if full time shift, otherwise need to split
      shiftsCollection.remove( { } );
      usersCollection.remove( { } );
    } catch (err) {
      console.log(err);
    }
  }

  exports.assign_shifts = async function(group) {
    try {
      matches = await this.all_shifts(group);
      while (matches && matches.length > 0){
        let match = matches[0];
        let user = {name: match.name, netid: match.netid};
        if(match.availability.times.start_time > match.matching_shifts[0].start_time && match.availability.times.end_time < match.matching_shifts[0].end_time){
          let first_shift =  JSON.parse(JSON.stringify(match.matching_shifts[0]));
          delete first_shift._id;
          first_shift["end_time"] = match.availability.times.start_time;
          await shiftsCollection.insertOne(first_shift);

          let third_shift = JSON.parse(JSON.stringify(match.matching_shifts[0]));
          delete third_shift._id;
          third_shift["start_time"] = match.availability.times.end_time;
          await shiftsCollection.insertOne(third_shift);

          shiftsCollection.updateOne(
            {"_id": ObjectId(match.matching_shifts[0]._id)}, 
            {$set: {start_time: match.availability.times.start_time, end_time: match.availability.times.end_time, employee: user, status: "scheduled" }}
            );
        }
        else if(match.availability.times.start_time > match.matching_shifts[0].start_time){
          let first_shift = JSON.parse(JSON.stringify(match.matching_shifts[0]));
          delete first_shift._id;
          first_shift["end_time"] = match.availability.times.start_time;
          await shiftsCollection.insertOne(first_shift);

          shiftsCollection.updateOne(
            {"_id": ObjectId(match.matching_shifts[0]._id)}, 
            {$set: {start_time: match.availability.times.start_time, employee: user, status: "scheduled" }}
            );
        }
        else if(match.availability.times.end_time < match.matching_shifts[0].end_time) {
          console.log("ending early: "+JSON.stringify(match));
          let second_shift = JSON.parse(JSON.stringify(match.matching_shifts[0]));
          delete second_shift._id;
          second_shift["start_time"] = match.availability.times.end_time;
          second_shift["status"] = "open";
          console.log("second shift:"+JSON.stringify(second_shift))
          await shiftsCollection.insertOne(second_shift);
          // let start = new Date(match.availability.times.end_time * 1000);
          // let end = new Date(second_shift.end_time * 1000);
          // console.log("new shift: " + start.toLocaleDateString() + ' ' + start.toLocaleTimeString() + " to " + end.toLocaleDateString() + ' ' + end.toLocaleTimeString())
          shiftsCollection.updateOne(
            {"_id": ObjectId(match.matching_shifts[0]._id)}, 
            {$set: {end_time: match.availability.times.end_time, employee: user, status: "scheduled" }}
            );
        }
        else {
          shiftsCollection.updateOne(
            {"_id": ObjectId(match.matching_shifts[0]._id)}, 
            {$set: {employee: user, status: "scheduled"}}
            );
        }
        usersCollection.updateOne(
          {"_id": ObjectId(match._id)}, 
          { $push: { previous_availability: match.availability.times }, $pull: { "availability.times": match.availability.times } }, 
          );
          matches = await this.all_shifts(group);
      }
      console.log("down here")
      return await shiftsCollection.find({"group": group } ).sort({"start_time":1}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

//   { $group : { _id : "$_id", 
//             "name": { "$first": "$name"}, 
//             "netid": { "$first": "$netid" },
//             "rank": { "$first": "$rank" },
//             "matching_shifts": { "$push": "$matching_shifts" },
//             "availability": { "$push": "$availability" }
//          } },

//,{ $merge: {into: "schedules"}}

//   exports.schedule4= async function(group) {
//     try {
//         return await shiftsCollection.aggregate([
//         { "$match": { "group": group, "status": "open"} },
//         { "$lookup": { 
//             "from": "users",
//             "let": { "start_time": '$start_time', "end_time": '$end_time' },
//         //     "pipeline": [
//         //       { $elemMatch: { start_time: { $lte: "$$start_time" }, end_time: { $gte: "$$end_time" } } }
//         //    ],
//         "pipeline": [
//             { "$match": {
//               "value": "1",
//               "$expr": { "$in": [ "$$id", "$contain" ] }
//             }}
//           ],
//            as: 'shifts'
//         }
// }
//       ]).toArray();
//       } catch (err) {
//         console.log(err);
//       }
//   }