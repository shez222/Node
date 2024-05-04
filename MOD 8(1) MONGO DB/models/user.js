const getDb = require('../util/database').getDb; //getting mongodbclient or database
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
class User{
    constructor(name,email,cart,id) {
        this.name = name;
        this.email = email
        // this._id = id? new mongodb.ObjectId(id):null
        this.cart = cart; //{items:[]}
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
        // let dbOp
        // if (this._id) {
        //     //$set this will set all new values remember that update one will only catch the prod which we want to update
        //     dbOp = db.collection('users').updateOne({_id: this._id}, { $set: this})
        // } else {
        //     dbOp = db.collection('users').insertOne(this);
        // }
        // return dbOp
        // .then((result) => {
        //     console.log(result);
        // }).catch((err) => {
        //     console.log(err);
        // });
    }

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(p=> {
            return p.productId.toString() === product._id.toString()  //.toString() is used to convert to string format
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items]
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ 
                productId: new ObjectId(product._id), 
                quantity: 1 
            })
        }
        const updateCart = {
            items: updatedCartItems
        }
        const db = getDb();
        return db.collection('users')
        .updateOne(
            {_id: this._id},
            {$set:{cart: updateCart}}
            )
    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map(p=>{  //bug cart has deleted productId still but nwill not find product on that id in products because it's deleted
           return p.productId;
        });//returninig all product ids from cart:items:[productId]
        return db.collection('products').find({_id: {$in: productIds}})
        .toArray()
        .then((products) => {
            return products.map(p=>{
                return {...p, quantity: this.cart.items.find(i=>{
                    return i.productId.toString() === p._id.toString()
                }).quantity
            }
            })
    
        });

    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item=>{
            return item.productId.toString() !== productId.toString()
        })
        const db = getDb();
        return db.collection('users')
        .updateOne(
            {_id : new ObjectId(this._id)},
            {$set:{cart: {items: updatedCartItems}}}
            )
    }

    addOrder(){
        const db = getDb();
        return this.getCart()
            .then(products=>{    
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name
                } 
            }
            return db.collection('orders').insertOne(order)
            })
            .then((result) => {
                this.cart = {items:[]};
                return db.collection('users')
                .updateOne(
                    { _id : new ObjectId(this._id) },
                    { $set: { cart: { items:[] } } }
                    ) 
            }).catch((err) => {
                console.log(err);
            });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders')
        .find( {'user._id': new ObjectId(this._id) })
        .toArray()
        .then((orders) => {
            console.log(orders);
            return orders
        }).catch((err) => {
            console.log(err);
        });
    }

    static findById(userId){
        const db = getDb()
        return db.collection('users')
        .findOne({_id: new ObjectId(userId)})
        .then((user) => {
            console.log(user);
            return user
        }).catch((err) => {
            console.log(err);
        });  //no next cursor because only one record
    }
}
module.exports = User;
