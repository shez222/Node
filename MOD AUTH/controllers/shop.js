const Product = require('../models/product');
const Order = require('../models/order');
//shop routes
//----------------------all product----------------------------
exports.getProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html'))
    Product.find() //here the find method is of mongoose not any mongodbquery 
        .then((products) => {
            // console.log(products);
            res.render('shop/product-list',{
                prods: products , 
                pageTitle: 'All Products', 
                path:'/products', 
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch((err) => {
            console.log(err);
        });
 };

//for product detail
 exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId) //another method findById  is of mongoose not any mongodbquery or custom created 
    .then((product) => {
        res.render('shop/product-detail',{
            product:product, 
            pageTitle: 
            product.title, 
            path:'/products',
            isAuthenticated: req.session.isLoggedIn
        
        })
    }).catch((err) => {
        console.log(err);
    });
 };

 //index page
 exports.getIndex = (req,res,next)=>{
    Product.find()
    .then((products) => {
        res.render('shop/index',{
            prods:products , 
            pageTitle: 'My Shop', 
            path:'/',
            isAuthenticated: req.session.isLoggedIn 
        });
    }).catch((err) => {
        console.log(err);
    });
}

// ---------------------------cart--------------------------------------
 //cart page
 exports.getCart = (req,res,next)=>{
    // console.log(req.session.user.cart);
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        // console.log(user.cart.items);
        const products = user.cart.items
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
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
        // console.log(result);
        res.redirect('/cart')
    })
    .catch((err) => {
        console.log(err);
    });
   
 };

  //deleting product from cart
 exports.postDeleteCartProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log(err);
    });

 }

// ------------------------------orders--------------------------
 exports.getOrders = (req,res,next)=>{
    Order.find({'user.userId': req.user._id})
    .then((orders) => {
        console.log(orders);
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
        }); 
    }).catch((err) => {
       console.log(err); 
    });

 };
 exports.postOrder = (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
        const products = user.cart.items.map(i=>{
            return { quantity: i.quantity, product: {...i.productId._doc} } //doc will give meta data of that product id means all field and (...spread) will store all the proerties in object(curlybraces) we created {...i.productId_doc}
        })
        const order = new Order({
            products: products,
            user:{
                userId: req.user
            }
        });
        return order.save();
    })
    .then((result) => {
        return req.user.clearCart();
    })
    .then((result) => {
        res.redirect('/orders')
    }).catch((err) => {
       console.log(err); 
    });
 }

//  exports.getCheckout = (req,res,next)=>{
//     res.render('shop/checkout',{
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
//  };