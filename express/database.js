const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = 'mongodb://colab:example@mongo:27017/development';
let mongodb;

function connect(callback){
    mongoClient.connect(mongoDbUrl, (err, db) => {
      console.log("ERROR");
      console.log(err);
      console.log("SUCCESS");
      console.log(db);
        mongodb = db;
        callback();
    });
}
function get(){
    return mongodb.db("development");
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close
};