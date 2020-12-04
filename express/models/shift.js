const db = require('../database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')

class Shift {
  // constructor({start_time, end_time, status, location, employee, group, supervisor}={}) {
  //   this.start_time = start_time;
  //   this.end_time = end_time;
  //   this.status = status;
  //   this.location = location;
  //   this.employee = employee;
  //   this.group = group;
  //   this.supervisor = supervisor;
  // }

  constructor(body) {
    this.body = body;
  }

  create = async () => {
    // try {
    //   return await shiftsCollection.insertOne(
    //       {
    //           "start_time": this.start_time, 
    //           "end_time": this.end_time, 
    //           "status": this.status,
    //           "location": this.location,
    //           "employee": this.employee,
    //           "group": this.group,
    //           "supervisor": this.supervisor
    //         })
    // } catch (err) {
    //   console.log(err)
    // }
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

}



module.exports = Shift