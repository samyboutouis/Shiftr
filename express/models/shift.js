const db = require('../database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')

class Shift {

  // access shift attributes through this.body.attribute
  // for example: this.body._id & this.body.start_time
  // checkout the shifts collection on mongodb to see which attributes are available
  constructor(body) {
    this.body = body;
  }

  create = async () => {
    try {
      return await shiftsCollection.insertOne(this.body)
    } catch (err) {
      console.log(err)
    }
  }

  delete = async () => {
    try{
      return await shiftsCollection.deleteOne({"_id": ObjectId(this.body._id)})
    } catch (err){
      console.log(err)
    }
  }

  update = async (newValues) => {
    try{
      return shiftsCollection.updateOne({"_id": ObjectId(this.body._id)}, {$set: newValues})
    } catch (err) {
      console.log(err)
    }
  }

  static all = async ()  => {
    try{
      // return await shiftsCollection.find().map(shift => new Shift(shift)).toArray();
      return await shiftsCollection.find().toArray();
    } catch (err) {
      console.log(err)
    }
  }

  static find = async (id)  => {
    try {
      let shift = await shiftsCollection.findOne({"_id": ObjectId(id)});
      return new Shift(shift)
    } catch (err) {
      console.log(err);
    }
  }
  static findOther = async (key, value)  => {
    try {
      return await shiftsCollection.find({[key]: value}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

// finding within times for calendar view
  static findByTime = async (start, end)  => {
    try {

      return await shiftsCollection.find({"start_time": {$gte: parseInt(start)}, "end_time": {$lte: parseInt(end)}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }
  static findByStart = async (start, end)  => {
    try {
      return await shiftsCollection.find({"start_time":  {$gte: parseInt(start), $lt: parseInt(end)} }).toArray();
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
              "status":"$status",
              "group":"$group",
              "employee":"$employee"
            }
          }
        }}
      ]).toArray();
      //       "_id": { "$divide": [ { "$mod": [ "$start_time", 1000 * 60 * 24 ] }, 1 ] },
    } catch (err) {
      console.log(err);
    }
  }

  static findByUser = async (netID)  => {
    try {
      return await shiftsCollection.find({"employee.netid": netID}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  static findByTimeAndUser = async (netID, start, end) => {
    try {
      console.log(start);
      console.log(end);
      console.log(netID);
      return await shiftsCollection.find({"employee.netid": netID, start_time: {$gte: parseInt(start)}, end_time: {$lte: parseInt(end)}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Shift
