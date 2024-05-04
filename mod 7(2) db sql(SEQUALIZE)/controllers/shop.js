
const Product = require('../models/product');
// const Cart = require('../models/cart')
//shop route
exports.getProducts = (req,res,next)=>{
    Product.findAll()
    .then(products => {
        res.render('shop/product-list',{
            prods: products , 
            pageTitle: 'All Products', 
            path:'/products', 
        });
    }).catch((err) => {
       console.log(err); 
    });


 };

 exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findByPk(prodId)
    .then(product=>{
        // console.log(product);
        res.render('shop/product-details',{
            product:product, 
            pageTitle: product.title,
            path:'/products'})
    })
    .catch(err=>{
        console.log(err);
    })

    //same above thing using query parameter
    // Product.findAll({ where: { id : prodId } })
    // .then((products) => {
    //         res.render('shop/product-details',{
    //         product:products[0], 
    //         pageTitle: products[0].title,
    //         path:'/products'})
    // }).catch((err) => {
    //     console.log(err);
    // });

 };

 exports.getIndex = (req,res,next)=>{
    Product.findAll()
    .then(products => {
        res.render('shop/index',{
            prods: products , 
            pageTitle: 'My Shop', 
            path:'/', 
        });
    }).catch((err) => {
       console.log(err); 
    });
 };

 exports.getCart = (req,res,next)=>{
    req.user
    .getCart()
    .then(cart => {
        return cart
        .getProducts()
        .then((products) => {
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
    })
    .catch((err) => {
        console.log(err);
    });
    // Cart.getCart(cart=>{
    //     Product.fetchAll(products=>{
    //         const cartProducts = [];
    //         for (const product of products) {
    //             const cartProductData = cart.products.find(
    //                 prod=> prod.id === product.id
    //             )
    //             if (cartProductData) {
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart',{
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     })
    // })

 };

 exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user
    .getCart()
    .then((cart) => {
        fetchCart = cart;
        return cart.getProducts({where: { id: prodId }});
    })
    .then(products=>{
        let product;
        if(products.length > 0){
            product = products[0]
        }
        if(product){
            // agar product pehla sa ha to
            const oldQuantity = product.cartItem.quantity
            newQuantity = oldQuantity + 1;
            return product;  
        }
        return Product.findByPk(prodId)
    })
    .then((product) => {
            //adding add product func in cart because of many to many relation 
            //as we know that we add cart item as in b/w model in poduct and cart in many many rel thats why we are using through to to provide extra fied in cart item model
        return fetchCart.addProduct(product,{ through : {quantity:newQuantity}});  //in this product is reference in cart for particular product or we can say forign key 
    })
    
    .then(result=>{
        res.redirect('/cart')
    })
    .catch((err) => {
        console.log(err);
    });
    
 };

 exports.postDeleteCartProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart()
    .then((cart) => {
        return cart.getProducts({where : {id : prodId}})
    })
    .then(products=>{
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result=>{
        res.redirect('/cart');
    })
    .catch((err) => {
        console.log(err);
    });

 }

 exports.postOrder = (req,res,next)=>{
    let fetchCart;
    req.user.getCart()
    .then((cart) => {
        fetchCart = cart;
        return cart.getProducts()
    })
    .then((products)=>{
        return req.user.createOrder()
        .then((order) => {
            return order.addProducts(
                products.map(product =>{
                    product.orderItem = { quantity : product.cartItem.quantity}
                    return product;
                }) 
            )
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .then(result=>{
        return fetchCart.setProducts(null);
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch((err) => {
        console.log(err);
    });
 }
 exports.getOrders = (req,res,next)=>{
    req.user.getOrders({include : ['products']})
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

