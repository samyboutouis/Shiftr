const db = require('./database');
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

exports.schedule3 = async function(group) {
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
                        { $lte: [ "$$start_time", "$end_time" ] },
                        { $gte: [ "$$end_time", "$start_time" ] } ] } } }
                ],
                "as": "matching_shifts"
            }}
        ]).toArray();
      } catch (err) {
        console.log(err);
      }
  }

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