// const mongodb = require('mongodb');
const Product = require('../models/product');
const fileHelper = require('../util/file')

const mongoose = require('mongoose');

const { validationResult } = require('express-validator');
// const ITEMS_PER_PAGE = 1;
//admin route

//------------------add prod ----------------------------
exports.getAddProducts = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle:'Add Product', 
        path:'/admin/add-product',
        editing:false,
        hasError:false,
        errorMessage: null, 
        validationErrors:[]
    }) 
}

exports.postAddProducts = (req,res,next)=>{
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;

    // console.log(res.locals);
    // console.log('first check');
    // console.log(imageUrl);
    if (!image) {
        return res.status(422).render('admin/edit-product',{
            pageTitle:'Add Product', 
            path:'/admin/add-product',
            editing:false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached image is not compatible',
            validationErrors:[] 
        }) 
    }
    // console.log(res.locals);
    // console.log('2nd check');
    const errors = validationResult(req)
    // console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product',{
            pageTitle:'Add Product', 
            path:'/admin/add-product',
            editing:false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors:errors.array() 
        }) 
    }
    // console.log(res.locals);
    // console.log('3rd check');
    const imageUrl = image.path;
    const product = new Product({
        // _id: new mongoose.Types.ObjectId('659b34c6660f85ee1dae7f8a'),
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    // console.log(res.locals);
    // console.log('4th check');
    product.save()
    .then((result) => {
        console.log('product created');
        res.redirect('/admin/products');
    }).catch((err) => {
        // console.log(err);
        // res.redirect('/500')
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}


//-------------------------del prod--------------------------
exports.deleteProduct= (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId).then((product) => {
        if (!product) {
            return next(new Error('Product not found'))
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({_id: prodId, userId: req.user._id})
    })
    .then((result) => {
        console.log('destroyed');
        res.json({
            message: 'Success'
        })
    }).catch((err) => {
        res.status(500).json ({
            message: 'deleting product fails'
        })
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
            hasError: false,
            product: product,
            errorMessage: null,
            validationErrors:[]
        }) 
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.postEditProducts =(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product',{
            pageTitle:'Edit Product', 
            path:'/admin/add-product',
            editing:true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors:errors.array()  
        }) 
    }
    // Product.findByIdAndUpdate()
    Product.findById(prodId)
    .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/')
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;  
        if (image) {
            fileHelper.deleteFile(product.imageUrl)
            product.imageUrl = image.path;
        }
        return product.save()
        .then((result) => {
            console.log('product updated');
            res.redirect('/admin/products');
        })
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

//-----------------------------get admin prod----------------------------
exports.getProducts = (req,res,next)=>{
    Product.find({userId: req.user._id})
    // .select('title price')  //select will give certaion fields of product like price,des,image etc it will give selected field of product
    // .populate('userId','name cart')// populate will simply give whole object with field where we defined id's
    .then((products) => {
        console.log(products);
        res.render('admin/products',{
            prods:products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
// exports.getProducts = (req,res,next)=>{
//     const page = +req.query.page || 1;
//     let totalItems;
//     // console.log(page);
//     Product.find({userId: req.user._id}).countDocuments().then(numProducts=>{  //this countDocument will coumt all documents in db
//         totalItems = numProducts;
//         return Product.find()
//         .skip((page -1) * ITEMS_PER_PAGE) //skiping the items which are appeaered on previous pages or we can say that it is a cursor on our products 
//         .limit(ITEMS_PER_PAGE) //limiting per page two items
//     })
//     .then((products) => {
//         res.render('admin/products',{
//             prods:products , 
//             pageTitle: 'Admin Products', 
//             path:'/admin/products', 
//             currentPage: page,
//             hasNextPage:ITEMS_PER_PAGE*page<totalItems,
//             hasPreviousPage: page > 1,
//             nextPage: page+ 1,
//             previousPage: page - 1,
//             lastPage: Math.ceil( totalItems/ ITEMS_PER_PAGE )
//         });
//     }).catch((err) => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//     })
// };