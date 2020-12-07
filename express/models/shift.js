const db = require('../database');
var ObjectId = require('mongodb').ObjectID;
const shiftsCollection = db.get().collection('shifts')

class Shift {

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
      // console.log("VALUE" + value)
      // console.log("KEY" + key)
      return await shiftsCollection.find({[key]: value}).toArray();
      // return new Shift(shift)

    } catch (err) {
      console.log(err);
    }
  }

}

module.exports = Shift
