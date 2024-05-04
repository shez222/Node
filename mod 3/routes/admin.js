const path = require('path');

const express = require('express');

const rootdir = require('../util/path');

const router = express.Router();

const product = [];

//full url /admin/add-product but filtered in main
///admin/add-product=>using GET
router.get('/add-product',(req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
    res.render('add-product',{pageTitle:'Add Product', path:'/admin/add-product', productCSS: true, formsCSS: true, activeAddProduct:true})  //layout:false if we dont want to use layout in a particular request
});
///admin/add-product=>using POST
router.post('/add-product', (req,res,next)=>{
    // console.log(req.method);
    // console.log(req.body); //parsing to use this func to print body
    product.push({title:req.body.title});

    res.redirect('/');

});

// module.exports = router;
exports.routes = router;
exports.products = product;

//we can initialize same route to diff middleware but diff method