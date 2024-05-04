const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //creating connection on atlas server

let _db; //for connection with database on atlas server
const mongoConnect = callback=>{
    MongoClient.connect('mongodb+srv://bilalshehroz420:00000@cluster0.wru7job.mongodb.net/shop?retryWrites=true&w=majority') //user info which we created on atlas
    .then((client) => {
        console.log('Connected!');
        _db = client.db(); //single client connection 
        callback()
    }).catch((err) => {
        console.log(err);
        throw err;
    });
};

const getDb = ()=>{
    if (_db) {
        return _db
    } else {
        throw 'no database found!'
    }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;