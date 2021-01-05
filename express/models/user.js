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

  static employeeList = async ()  => {
    try{
      var admins = await usersCollection.find({"role": "admin"}).sort({"role":1}).toArray();
      var supervisors = await usersCollection.find({"role": "supervisor"}).sort({"role":1}).toArray();
      var employees = await usersCollection.find({"role": "employee"}).sort({"role":1}).toArray();
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
}


module.exports = User
