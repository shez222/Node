
const Product = require('../models/product');
const Cart = require('../models/cart')
//shop route
exports.getProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html'))
 Product.fetchAll()
 .then(([rows,fieldData])=>{
    // console.log(rows,fieldData); dono chezain arhi ha type of rows(no of elemnts) and data(fielddata)
    res.render('shop/product-list',{
        prods:rows , 
        pageTitle: 'All Products', 
        path:'/products', 
    });
 })
 .catch(err=>{
    console.log(err);
 })

 };

 exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .then(([product])=>{
        // console.log(product);
        res.render('shop/product-details',{
            product:product[0], 
            pageTitle: product.title,
            path:'/products'})
    })
    .catch(err=>{
        console.log(err);
    })

 };

 exports.getIndex = (req,res,next)=>{
    Product.fetchAll()
    .then(([rows,fieldData])=>{
        res.render('shop/index',{
            prods: rows , 
            pageTitle: 'My Shop', 
            path:'/', 
        });
    })
    .catch(err=>{
        console.log(err);
    })

 };

 exports.getCart = (req,res,next)=>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for (const product of products) {
                const cartProductData = cart.products.find(
                    prod=> prod.id === product.id
                )
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        })
    })

 };

 exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,product=>{
        Cart.addProduct(prodId,product.price);
    })
    res.redirect('/')
 };

 exports.postDeleteCartProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,product=>{
        Cart.deleteProduct(prodId,product.price)
        res.redirect('/cart')
    })

 }

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