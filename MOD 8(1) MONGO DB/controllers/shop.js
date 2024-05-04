const Product = require('../models/product');
const User = require('../models/user');
//shop routes
//----------------------all product----------------------------
exports.getProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html'))
    Product.fetchAll()
        .then((products) => {
            res.render('shop/product-list',{
                prods: products , 
                pageTitle: 'All Products', 
                path:'/products', 
            });
        }).catch((err) => {
            console.log(err);
        });
 };

//for product detail
 exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .then((product) => {
        res.render('shop/product-details',{
            product:product, 
            pageTitle: 
            product.title, 
            path:'/products'})
    }).catch((err) => {
        console.log(err);
    });
 };

 //index page
 exports.getIndex = (req,res,next)=>{
    Product.fetchAll()
    .then((products) => {
        res.render('shop/index',{
            prods:products , 
            pageTitle: 'My Shop', 
            path:'/', 
        });
    }).catch((err) => {
        console.log(err);
    });
}

// ---------------------------cart--------------------------------------
 //cart page
 exports.getCart = (req,res,next)=>{
    req.user
    .getCart()
    .then((products) => {
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    }).catch((err) => {
        console.log(err);
    });

 };

 //adding product to cart
 exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then((product) => {
        return req.user.addToCart(product)
    })
    .then(result=>{
        console.log(result);
        res.redirect('/cart')
    })
    .catch((err) => {
        console.log(err);
    });
   
 };

  //deleting product from cart
 exports.postDeleteCartProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log(err);
    });

 }

// ------------------------------orders--------------------------
exports.postOrder = (req,res,next)=>{
    req.user
    .addOrder()
    .then((result) => {
        res.redirect('/orders')
    }).catch((err) => {
       console.log(err); 
    });
 }
 exports.getOrders = (req,res,next)=>{
    req.user
    .getOrders()
    .then((orders) => {
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        }); 
    }).catch((err) => {
       console.log(err); 
    });

 };

//  exports.getCheckout = (req,res,next)=>{
//     res.render('shop/checkout',{
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
//  };