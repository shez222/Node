const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');
const session = require('express-session');
const stripe = require('stripe')('sk_test_51OXlAIAZK57wNYnQQluuPOe6YHwpKCs2dZfKLaEe7Ye67OObYR3Hes3i0Vjo1yp450mlVWQ9ufvWWYYymF1mc33R00GwSCgwFi');
const ITEMS_PER_PAGE = 1;
//shop routes
//----------------------all product----------------------------
exports.getProducts = (req,res,next)=>{
    // console.log(req.method);
    // console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html'))
    // Product.find() //here the find method is of mongoose not any mongodbquery 
    //     .then((products) => {
    //         // console.log(products);
    //         res.render('shop/product-list',{
    //             prods: products , 
    //             pageTitle: 'All Products', 
    //             path:'/products', 
    //         });
    //     }).catch((err) => {
    //         const error = new Error(err);
    //         error.httpStatusCode = 500;
    //         return next(error);
    //     });
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
        })
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
 };

 //index page
 exports.getIndex = (req,res,next)=>{
    const page = +req.query.page || 1;
    let totalItems;
    // console.log(page);
    Product.find().countDocuments().then(numProducts=>{  //this countDocument will coumt all documents in db
        totalItems = numProducts;
        return Product.find()
        .skip((page -1) * ITEMS_PER_PAGE) //skiping the items which are appeaered on previous pages or we can say that it is a cursor on our products 
        .limit(ITEMS_PER_PAGE) //limiting per page two items
    })
    .then((products) => {
        res.render('shop/index',{
            prods:products , 
            pageTitle: 'My Shop', 
            path:'/',
            currentPage: page,
            hasNextPage:ITEMS_PER_PAGE*page<totalItems,
            hasPreviousPage: page > 1,
            nextPage: page+ 1,
            previousPage: page - 1,
            lastPage: Math.ceil( totalItems/ ITEMS_PER_PAGE )
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// ---------------------------cart--------------------------------------
 //cart page
 exports.getCart = (req,res,next)=>{
    // console.log(req.session.user.cart);
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        console.log(user.cart.items);
        const products = user.cart.items
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
   
 };

  //deleting product from cart
 exports.postDeleteCartProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
        }); 
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

 };
 exports.getCheckout = (req, res, next) => {

    let products;
    let total;
    req.user
    .populate("cart.items.productId")
    .then((user) => {
        products = user.cart.items;
        total = products.reduce((acc, p) =>
        acc + p.quantity * p.productId.price,0
        ); 
        const productPromises = products.map((p) =>
            p.productId
            ).map((product) => {
            return stripe.products
            .create({
            name: product.title,
            description: product.description,
            type: "good",
        })   
        .then((stripeProduct) => {
                // console.log(stripeProduct);
            return stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: product.price * 100,
            currency: "pkr",
            });
        })  
        .then((price) => {
            // console.log(price);
            console.log(products
                .filter((p) => p.productId === product)
                .map(p => p.quantity).toString());
            return {
            price: price.id,
            quantity: products
            .filter((p) => p.productId === product)
            .reduce((acc, p) => acc + p.quantity, 0),
            }; 

        })
    .catch((error) => {
        console.error("Error creating Stripe product or price:", error);
        throw error;
        });
    }); 
    // console.log(productPromises);
    return Promise.all(productPromises);
    })
    .then((lineItems) => {
    
        return stripe.checkout.sessions.create({   
        payment_method_types: ["card"], 
        line_items: lineItems,
        mode: "payment", 
        success_url:req.protocol + "://" + req.get("host") + "/checkout/success", 
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",  
        });
    
    })
    .then((session) => {
    
        res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout Page",
        products: products,
        totalSum: total,
        sessionId: session.id,
        });
    
    })
    .catch((err) => {   
        console.error("Error during checkout:", err);        
        const error = new Error(err);        
        error.httpStatusCode = 500;       
        return next(error);        
        });
    };
//  exports.getCheckout = (req,res,next)=>{
//     let products;
//     let total;
//     req.user
//     .populate('cart.items.productId')
//     .then((user) => {
//         // console.log(user.cart.items);
//         products = user.cart.items
//         total = 0;
//         products.forEach(p=>{
//             total += p.quantity * p.productId.price
//         })
//         console.log('check 1');
//         // console.log(session.id);
//         // let array =  products.map(p=>{
//         //         return {
//         //             // name: p.productId.title,
//         //             // description: p.productId.description,
//         //             price_data: {
//         //                 currency: 'pkr',
//         //                 product_data: {
//         //                     name: 'some product'
//         //                 },
//         //                 unit_amount: '222'
//         //             },
//         //             // currency: 'usd',
//         //             quantity: '1'
//         //         }
//         //     })
//         // console.log(array);
//         // console.log(stripe);
//         const session =  stripe.checkout.session.create({
//             // console.log(stripe);
//             payment_method_types:['card'],
//             mode: 'payment',
//             line_items: [{
//                 // name: p.productId.title,
//                 // description: p.productId.description,
//                 price_data: {
//                     currency: 'pkr',
//                     product_data: {
//                         name: 'some product'
//                     },
//                     unit_amount: '222'
//                 },
//                 // currency: 'usd',
//                 quantity: '1'
//             }],
//             success_url: `${req.protocol}://${req.get('host')}/checkout/success`, //=>http://localhost:3000/checkout/msg
//             cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
           
//         })
//         console.log(session.id);

//         return session;
//     })
//     .then(session=>{
//         res.render('shop/checkout',{
//             path: '/checkout',
//             pageTitle: 'Checkout',
//             products: products,
//             totalSum: total,
//             sessionId: session.id
//         });
//     })
//     .catch((err) => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//     });
//  }
 exports.getCheckoutSuccess = (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
        const products = user.cart.items.map(i=>{
            return { quantity: i.quantity, product: {...i.productId._doc} } //doc will give meta data of that product id means all field and (...spread) will store all the proerties in object(curlybraces) we created {...i.productId_doc}
        })
        const order = new Order({
            products: products,
            user:{
                email: req.user.email,
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
 }

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
                email: req.user.email,
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
 }

//  exports.getCheckout = (req,res,next)=>{
//     res.render('shop/checkout',{
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
//  };

//------------------------invoice-----------------
exports.getInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    Order.findById(orderId).then((order) => {
        if (!order) {
            return next( new Error('No Order found'))
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'))
        }
        //this code is okay with short file but cannot work with bigger file
        const invoiceName = 'invoice-'+ orderId + '.pdf';
        const invoicePath = path.join('data','invoices',invoiceName)
        //dynamic file reaading
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');//define hoe thhhhis content will be serve to client
        pdfDoc.pipe(fs.createWriteStream(invoicePath));//writing stream on here
        pdfDoc.pipe(res) //snding res
        // pdfDoc.text('Hellllllllllllllllllllo!!!!!!!!') //writing text to file
        pdfDoc.fontSize(29).text('INVOICE',{
            underline: true,
            align: 'center',
            
        })
        pdfDoc.fontSize(15).text('------------',{
            align: 'center'
        })
        let totalPrice = 0;
        order.products.forEach(prod =>{
            totalPrice += prod.product.price
            pdfDoc.fontSize(15).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`,{
                align:'center'
            })
        })
        pdfDoc.fontSize(15).text('---------------',{
            align:'center'
        })
        pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`,{
            align:'center'});
        pdfDoc.end()//this will close the stream

        
        // fs.readFile(invoicePath, (err, data)=>{
        //     if (err) {
        //         return next(err);
        //     }
        //     res.setHeader('Content-Type','application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');//define hoe thhhhis content will be serve to client
        //     res.send(data);
        // })
        //alternate method to read bigger file and small both static file
        // const file = fs.createReadStream(invoicePath); //read a stream provided with path of the file
        //     res.setHeader('Content-Type','application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');//define hoe thhhhis content will be serve to client
        //     file.pipe(res) // apipe which will pass our streamed data to res
    }).catch((err) => {
        console.log(err);
    });

}