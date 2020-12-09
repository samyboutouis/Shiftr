const db = require('./database');
const shiftsCollection = db.get().collection('shifts')
const usersCollection = db.get().collection('users')

exports.schedule = async function() {
    try {
      let openShifts = await shiftsCollection.find({"status": "open"}).toArray();
      let users = new Array();
      for (const shift of openShifts) {
        users.push(await usersCollection.find({"group": shift.group, "availability.times": { $elemMatch: { start_time: { $lte: shift.start_time }, end_time: { $gte: shift.end_time } } }}).toArray());
      }
      return users;
    } catch (err) {
      console.log(err);
    }
  }