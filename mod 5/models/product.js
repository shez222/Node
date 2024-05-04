const fs = require('fs');
const path = require('path');

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
    constructor(title,imageUrl,description,price) {
        this.title  = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){     
        getProductsFromFile(products=>{
            products.push(this)
            fs.writeFile(p,JSON.stringify(products),err=>{
                // console.log(err);
            })
        }) 
        
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }
}

//logic behin call back
// Product.fetchAll((products)=>{  //in this(product)=>{} this is passing as a call back  call back means wo cb func tab tak run
//     //  nahi hoga jab tak wo jis func ka cb ha us ka sara opration perform na hogy or 
//     // jab wo func perform hogy gy to usma sa jo data nikla ha wo cb func ka argument ma jy ga jest (product //is ki jaga pa)=>{or isma wo data use hoga}
//     res.render('shop',{prods:products , pageTitle: 'My Shop', path:'/', hasProducts: products.length > 0, productCSS: true, activeShop:true});
// }); // isma pas horaha   getProductsFromFile(cb);