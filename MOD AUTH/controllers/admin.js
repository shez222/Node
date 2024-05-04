// const mongodb = require('mongodb');
const product = require('../models/product');
const Product = require('../models/product');


//admin route

//------------------add prod ----------------------------
exports.getAddProducts = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle:'Add Product', 
        path:'/admin/add-product',
        editing:false, 
        isAuthenticated: req.session.isLoggedIn
    }) 
}

exports.postAddProducts = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
    .then((result) => {
        console.log('product created');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });

}


//-------------------------del prod--------------------------
exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId
    Product.findByIdAndDelete(prodId)
    .then((result) => {
        console.log('destroyed');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
    
}

//-------------------------edit prod--------------------------------
exports.getEditProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId
    Product.findById(prodId)
    .then((product) => {
        if (!product) {
            res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:'Edit Product ', 
            path:'/admin/edit-product',
            editing:editMode, 
            product: product,
            isAuthenticated: req.session.isLoggedIn
        }) 
    }).catch((err) => {
        console.log(err);
    });

}

exports.postEditProducts =(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    
    // Product.findByIdAndUpdate()
    Product.findById(prodId)
    .then((product) => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
    .then((result) => {
        console.log('product updated');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
}

//-----------------------------get admin prod----------------------------
exports.getProducts = (req,res,next)=>{
    Product.find()
    // .select('title price')  //select will give certaion fields of product like price,des,image etc it will give selected field of product
    // .populate('userId','name cart')// populate will simply give whole object with field where we defined id's
    .then((products) => {
        console.log(products);
        res.render('admin/products',{
            prods:products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch((err) => {
       console.log(err); 
    });
};
