const Product = require('../models/product');
//shop route
exports.getProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html'))
 Product.fetchAll((products)=>{
        res.render('shop/product-list',{
            prods:products , 
            pageTitle: 'All Products', 
            path:'/products', 
        });
    });
 };

 exports.getIndex = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/index',{
            prods:products , 
            pageTitle: 'My Shop', 
            path:'/', 
        });
    });
 };

 exports.getCart = (req,res,next)=>{
    res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Your Cart'
    });
 };

 exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders'
    });
 };

 exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout'
    });
 };