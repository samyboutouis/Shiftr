const db = require('../database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')

// TODO: decide if we're actually using the model format or just working with json/mongo
class Shift {

  // access shift attributes through this.body.attribute
  // for example: this.body._id & this.body.start_time
  // checkout the shifts collection on mongodb to see which attributes are available
  constructor(body) {
    this.body = body;
  }

  // create new shift
  create = async () => {
    try {
      return await shiftsCollection.insertOne(this.body)
    } catch (err) {
      console.log(err)
    }
  }

  // delete shift
  delete = async () => {
    try{
      return await shiftsCollection.deleteOne({"_id": ObjectId(this.body._id)})
    } catch (err){
      console.log(err)
    }
  }

  // update shift
  update = async (newValues) => {
    try{
      return shiftsCollection.updateOne({"_id": ObjectId(this.body._id)}, {$set: newValues})
    } catch (err) {
      console.log(err)
    }
  }

  // find all shifts
  static all = async ()  => {
    try{
      // return await shiftsCollection.find().map(shift => new Shift(shift)).toArray();
      return await shiftsCollection.find().toArray();
    } catch (err) {
      console.log(err)
    }
  }

  // find one shift by id
  static find = async (id)  => {
    try {
      let shift = await shiftsCollection.findOne({"_id": ObjectId(id)});
      return new Shift(shift)
    } catch (err) {
      console.log(err);
    }
  }

  // find shift by key/value pair
  static findByKeyValue = async (key, value)  => {
    try {
      return await shiftsCollection.find({[key]: value}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

// find shifts in time range (for calendar view)
  static findByTime = async (start, end)  => {
    try {
      return await shiftsCollection.find({"start_time": {$gte: parseInt(start)}, "end_time": {$lte: parseInt(end)}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  // group shifts by hour
  static findByHour = async (start, end)  => {
    try {
      return await shiftsCollection.aggregate([
        { "$match": {"start_time":  {$gte: parseInt(start), $lt: parseInt(end)} }}, //shifts within time range
        { "$group": {
          "_id": { "$hour": { "$toDate": { "$toLong": {"$multiply": ["$start_time",1000]}}} }, //group by hour
          "data":{
            "$push":{
              "start_time":"$start_time",
              "end_time":"$end_time",
              "location":"$location",
              "status":"$status",
              "group":"$group",
              "employee":"$employee"
            }
          }
        }}
      ]).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  // get hours stats (for employee 'hours' page)
  static findEmployeeHours = async (netid, date)  => {
    try {
      var shifts = await shiftsCollection.aggregate([
        // check netid matches, employee clocked in and clocked out, and the shift was within the page's time range
        { $match: {
          "employee.netid": netid, 
          "clocked_in": {$exists: true}, 
          "clocked_out": {$exists: true}, 
          "end_time": {$lte: Date.now()/1000}, 
          "start_time": {$gte: date} }
        }, 
        { $project: { 
          "clocked_in":1, 
          "clocked_out":1, 
          "start_time":1, 
          "end_time":1, 
          // calculate length of shift
          "total_hours": { 
            $subtract: ["$clocked_out", "$clocked_in"] 
          }, 
          // calculate time worked outside of regular hours
          "ot_hours": { $add: [ 
            { $cond: [ 
              { $gte: [ "$clocked_in", "$start_time" ] }, 
              0, 
              {$subtract: ["$start_time", "$clocked_in"]} ] }, 
            { $cond: [ 
              { $lte: [ "$clocked_out", "$end_time" ] }, 
              0, 
              {$subtract: ["$clocked_out", "$end_time"]}]}]}
            } 
          }]).toArray();
      // returns shift information as well as total hours over the time period
      return {
        shifts: shifts, 
        total_hours: shifts.reduce((sum, shift) => sum + shift.total_hours, 0), 
        total_ot: shifts.reduce((sum, shift) => sum + shift.ot_hours, 0)}
    } catch (err) {
      console.log(err);
    }
  }

  static findSupervisorHours = async (group, date)  => {
    try {
      var employees = await shiftsCollection.aggregate([
        { $match: {"group": { $in: group }, "clocked_in": {$exists: true}, "clocked_out": {$exists: true}, "end_time": {$lte: Date.now()/1000}, "start_time": {$gte: date}} }, 
        { $group: { "_id": "$employee.netid", "name": { "$first": "$employee.name" }, "total_hours": { $sum: { $subtract: ["$clocked_out", "$clocked_in"] }}}} ]).toArray();
      for (var i=0; i<employees.length; i++) {
        employees[i].details = await this.findEmployeeHours(employees[i]._id, date)
      }
      return employees
    } catch (err) {
      console.log(err);
    }
  }

  static supervisorSchedule = async (netid, start, end)  => {
    try {
      return await shiftsCollection.find({"supervisor.netid": netid, start_time: {$gte: start}, end_time: {$lte: end}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  static findByTimeAndUser = async (netID, start, end) => {
    try {
      return await shiftsCollection.find({"employee.netid": netID, start_time: {$gte: parseInt(start)}, end_time: {$lte: parseInt(end)}, clocked_out: {$exists: false}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  static findConflict = async (netID, start, end) => {
    try {
      return await shiftsCollection.find({"employee.netid": netID, start_time: {$lt: parseInt(end)}, end_time: {$gt: parseInt(start)}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Shift
