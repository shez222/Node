const Product = require('../models/product');
//admin route
exports.getAddProducts = (req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
    res.render('admin/add-product',{
        pageTitle:'Add Product', 
        path:'/admin/add-product', 
        productCSS: true, 
        formsCSS: true, 
        activeAddProduct:true
    })  //layout:false if we dont want to use layout in a particular request
}

exports.postAddProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log(req.body); //parsing to use this func to print body
    // products.push({title:req.body.title});
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title,imageUrl,description,price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{
            prods:products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
        });
    });
};
