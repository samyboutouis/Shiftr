const db = require('../database');
const usersCollection = db.get().collection('users')



class User {
  // note the "strange" {key,key,key,ect...}={} notation, that allows us to pass in a JS object to initialize
  constructor({name, age, admin}={}) {
    this.name = name.toLowerCase();
    this.age = age;
    this.admin = admin
  }

  //create a new user
  create = async () => {
    try {
      return await usersCollection.insertOne({"name": this.name, "age": this.age, "admin": this.admin})
    } catch (err) {
      console.log(err)
    }
  }


  //delete
  delete = async () => {
    try{
      return await usersCollection.deleteOne({"name": this.name})
    } catch (err){
      console.log(err)
    }
  }

  //update a user
  update = async (newValues) => {
    try{
      return usersCollection.updateOne({"name": this.name}, {$set: newValues})
    } catch (err) {
      console.log(err)
    }
  }

  //get a all users TODO: all cast all as user objects
  static all = async ()  => {
    try{
      return await usersCollection.find().toArray();
    } catch (err) {
      console.log(err)
    }
  }

  //find one user
  static find = async (name)  => {
    try {
      let user = await usersCollection.findOne({"name": name});
      return new User(user)
    } catch (err) {
      console.log(err);
    }
  }

}



module.exports = User
