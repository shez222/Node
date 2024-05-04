const mongodb = require('mongodb');
const Product = require('../models/product');


//admin route

//------------------add prod ----------------------------
exports.getAddProducts = (req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
    res.render('admin/edit-product',{
        pageTitle:'Add Product', 
        path:'/admin/add-product',
        editing:false, 
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
    const product = new Product(title,imageUrl,description,price,null,req.user._id);
    product.save()
    .then((result) => {
        console.log('product created');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
    // res.redirect('/');
}


//-------------------------del prod--------------------------
exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId
    Product.deleteById(prodId)
    .then((result) => {
        console.log('destroyed');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
    
}

//-------------------------edit prod--------------------------------
exports.getEditProducts = (req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
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
            product: product
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
    
    const product = new Product(
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice,
        prodId
        )
    product.save()
    .then((result) => {
        console.log('product updated');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
}

//-----------------------------get admin prod----------------------------
exports.getProducts = (req,res,next)=>{
    Product.fetchAll()
    .then((products) => {
        res.render('admin/products',{
            prods:products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
        });
    }).catch((err) => {
       console.log(err); 
    });
};
