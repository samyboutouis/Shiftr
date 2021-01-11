const db = require('../database');
var ObjectId = require('mongodb').ObjectID;
const usersCollection = db.get().collection('users')

class User {

  // access user attributes through this.body.attribute
  // for example: this.body._id & this.body.name
  // checkout the users collection on mongodb to see which attributes are available
  constructor(body) {
    this.body = body;
  }

  //create a new user
  create = async () => {
    try {
      // converts groups from string separated by commas to array
      if(this.body.group){
        this.body.group = this.body.group.split(",");
      }
      return await usersCollection.insertOne(this.body)
    } catch (err) {
      console.log(err)
    }
  }

  //delete
  delete = async () => {
    try{
      return await usersCollection.deleteOne({"_id": ObjectId(this.body._id)})
    } catch (err){
      console.log(err)
    }
  }

  //update a user
  update = async (newValues) => {
    try{
      return usersCollection.updateOne({"_id": ObjectId(this.body._id)}, {$set: newValues})
    } catch (err) {
      console.log(err)
    }
  }

  //get all users TODO: cast all as user objects
  static all = async ()  => {
    try{
      return await usersCollection.find().toArray();
    } catch (err) {
      console.log(err)
    }
  }

  // gets all relevant users for supervisor 'employees' page
  // checks that user's group list intersects with the supervisor's group list
  // also checks that netid isn't the current supervisor
  static employeeList = async (group, netid)  => {
    try{
      var employees = await usersCollection.aggregate([ 
        { "$match" : { "role": "employee", "netid": { "$ne": netid}}},
        { "$unwind" : "$group" },
        { "$match"  : { "group" : { "$in" : group } } },
        { "$group"  : { 
          "_id" : "$_id", 
          "group" : { "$push" : "$group" }, 
          "netid": { "$first": "$netid" }, 
          "name": { "$first": "$name" }, 
          "email": { "$first": "$email" }, 
          "role": { "$first": "$role" } 
        } }
       ]).toArray();
       
       var admins = await usersCollection.aggregate([ 
        { "$match" : { "role": "admin", "netid": { "$ne": netid}}},
        { "$unwind" : "$group" },
        { "$match"  : { "group" : { "$in" : group } } },
        { "$group"  : { 
          "_id" : "$_id", 
          "group" : { "$push" : "$group" }, 
          "netid": { "$first": "$netid" }, 
          "name": { "$first": "$name" }, 
          "email": { "$first": "$email" }, 
          "role": { "$first": "$role" } 
        } }
       ]).toArray();
       
       var supervisors = await usersCollection.aggregate([ 
        { "$match" : { "role": "supervisor", "netid": { "$ne": netid}}},
        { "$unwind" : "$group" },
        { "$match"  : { "group" : { "$in" : group } } },
        { "$group"  : { 
          "_id" : "$_id", 
          "group" : { "$push" : "$group" }, 
          "netid": { "$first": "$netid" }, 
          "name": { "$first": "$name" }, 
          "email": { "$first": "$email" }, 
          "role": { "$first": "$role" } 
        } }
       ]).toArray();
      // var admins = await usersCollection.find({role: "admin", group: { $in: group }, netid: { $ne: netid}}).sort({"role":1}).toArray();
      // var supervisors = await usersCollection.find({role: "supervisor", group: { $in: group }, netid: { $ne: netid}}).sort({"role":1}).toArray();
      // var employees = await usersCollection.find({role: "employee", group: { $in: group }, netid: { $ne: netid}}).sort({"role":1}).toArray();
      return {admins: admins, supervisors: supervisors, employees: employees};
    } catch (err) {
      console.log(err)
    }
  }

  //find one user
  static find = async (id)  => {
    try {
      let user = await usersCollection.findOne({"_id": ObjectId(id)});
      return new User(user)
    } catch (err) {
      console.log(err);
    }
  }

  //create user if absent
  static createIfAbsent = async (values) => {
    try {
      let user = await usersCollection.findOne({"netid": values.netid});
      if(user == null){
        return await usersCollection.insertOne(values);
      }
      return new User(user)
    } catch(err) {
      console.log(err);
    }
  }

  //find one user by email
  static findByEmail = async (email)  => {
    try {
      let user = await usersCollection.findOne({"email": email});
      return new User(user)
    } catch (err) {
      console.log(err);
    }
  }
  //find user by availability
  static findByAvailability = async (start, end)  => {
    try {
      return await usersCollection.find({day: {$gte: day}, start_time: {$gte: start}, end_time: {$lte: end}}).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  // get user's permission level
  // should return {role: "supervisor/admin/employee", group: [Group 1, Group 2, Group 3]}
  static getPermissions = async (netid) => {
    try {
      var permissions = await usersCollection.aggregate([
        {$match: {netid: netid}}, 
        {$project: {_id: 0, role: 1, group: 1}}]).toArray();
      return permissions[0];
    } catch (err) {
      console.log(err);
    }
  }
 
  static add_availability = async (id, newValues) => {
    try{
      return usersCollection.updateOne({"_id": ObjectId(id)}, {$push: {"availability.times" : {"day": newValues.day, "start_time": parseInt(newValues.start_time), "end_time": parseInt(newValues.end_time)}}})
    } catch (err) {
      console.log(err)
 }

}
}

module.exports = User
