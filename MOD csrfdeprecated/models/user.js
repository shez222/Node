const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    resetToken: {
        type: String
    },
        
    resetTokenExpiration: {
        type: Date
    },
    cart: {
        items: [{
            productId:{
               type: Schema.Types.ObjectId,
               ref: 'Product',
               required: true
            },
            quantity: {
                type: Number,
                required:true
            }
        }
        ,
        // totalQuantity = {
        //     type: Number,
        //     required:true
        // }     
    ]
    }
});

//we can also build our own methods in mongoose like this
userSchema.methods.addToCart = function (product) {
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
                productId: product._id, 
                quantity: newQuantity 
            })
        }
        const updatedCart = {
            items: updatedCartItems
        }
        this.cart = updatedCart;
        return this.save()
}
userSchema.methods.removeFromCart = function (productId) {
        const updatedCartItems = this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems;
    return this.save();
}
userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}
module.exports = mongoose.model('User', userSchema);

