const getDb = require("../util/database").getDb; //importing getDb func from ../util/database
const mongodb = require('mongodb');
class Product{
    constructor(title,imageUrl,description,price,id,userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        //adding null when adding a product
        this._id = id ? new mongodb.ObjectId(id): null //we are directly converting type of id when editing
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp
        if (this._id) {
            //$set this will set all new values remember that update one will only catch the prod which we want to update
            dbOp = db.collection('products').updateOne({_id: this._id}, { $set: this})
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then((products) => {
            console.log(products);
            return products
        }).catch((err) => {
            console.log(err);
        });
    }
    static findById(prodId) {
        const db = getDb()
        return db.collection('products')
        .find({_id:new mongodb.ObjectId(prodId)})
        .next() // all document a/c to query it will retrieve next doc which satisfies the query
        .then((product) => {
            console.log(product);
            return product
        }).catch((err) => {
            console.log(err);
        });
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then((result) => {
            console.log('product deletedd');
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = Product;