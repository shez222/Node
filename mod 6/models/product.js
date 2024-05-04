const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

const getProductsFromFile = (cb)=>{
    fs.readFile(p,(err,filecontent)=>{
        if (err) {
            return cb([])
        }
        else{
            cb(JSON.parse(filecontent))
        }
        
    });
}

module.exports = class Product{
    constructor(id,title,imageUrl,description,price) {
        this.id = id;
        this.title  = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){       
        getProductsFromFile(products=>{
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod=> prod.id === this.id
                )
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
                    // console.log(err);
                })
            } else {
                this.id = Math.random().toString();
                products.push(this)
                fs.writeFile(p,JSON.stringify(products),err=>{
                    // console.log(err);
                })
            }
        }) 
        
    }

    static deleteById(id){
        getProductsFromFile(products=>{
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            // console.log(deletedProduct);
            fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
                if (!err) {
                    Cart.deleteProduct(id,product.price);
                }
            })
        })
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id,cb){
        getProductsFromFile(products=>{
            const product = products.find(p=>p.id===id);
            cb(product)
        })
    }
}

//logic behin call back
// Product.fetchAll((products)=>{  //in this(product)=>{} this is passing as a call back  call back means wo cb func tab tak run
//     //  nahi hoga jab tak wo jis func ka cb ha us ka sara opration perform na hogy or 
//     // jab wo func perform hogy gy to usma sa jo data nikla ha wo cb func ka argument ma jy ga jest (product //is ki jaga pa)=>{or isma wo data use hoga}
//     res.render('shop',{prods:products , pageTitle: 'My Shop', path:'/', hasProducts: products.length > 0, productCSS: true, activeShop:true});
// }); // isma pas horaha   getProductsFromFile(cb);