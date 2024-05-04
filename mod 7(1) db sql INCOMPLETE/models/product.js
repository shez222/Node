const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product{
    constructor(id,title,imageUrl,description,price) {
        this.id = id;
        this.title  = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){       
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)',
            [this.title,this.price,this.imageUrl,this.description]
        );
    }

    static deleteById(id){
        
    }

    static fetchAll(){
        return db.execute('SELECT * FROM products'); //*: means everything from respective table
    }

    static findById(id){
       return db.execute(
            'SELECT * FROM products WHERE products.id = ?',[id]
       );
    }
}

//logic behin call back
// Product.fetchAll((products)=>{  //in this(product)=>{} this is passing as a call back  call back means wo cb func tab tak run
//     //  nahi hoga jab tak wo jis func ka cb ha us ka sara opration perform na hogy or 
//     // jab wo func perform hogy gy to usma sa jo data nikla ha wo cb func ka argument ma jy ga jest (product //is ki jaga pa)=>{or isma wo data use hoga}
//     res.render('shop',{prods:products , pageTitle: 'My Shop', path:'/', hasProducts: products.length > 0, productCSS: true, activeShop:true});
// }); // isma pas horaha   getProductsFromFile(cb);