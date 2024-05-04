const Product = require('../models/product');
//admin route
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
    // //can be done like this if we have association
    // Product.create({
    //     title : title,
    //     price : price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     userId: req.user.id
    // })
    //but if we have association b/w tbale than that association provides diff func which we could a/c to given user
    req.user     //this rule provide by assocition of user and product
    .createProduct({  //req.
        title : title,
        price : price,
        imageUrl: imageUrl,
        description: description,
    })
    .then((result) => {
        // console.log(result);
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err);
    });
}

exports.getEditProducts = (req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId
    // Product.findByPk()
    req.user
    .getProducts({where: {id:prodId} })
    .then(products=>{
        const product = products[0]
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
    Product.findByPk(prodId)
    .then((product) => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save()
    })
    .then(result=>{
        console.log('updated product');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });

}

exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId
    Product.findByPk(prodId)
    .then((product) => {
        return product.destroy();
    })
    .then(result=>{
        console.log('deleted product');
        res.redirect('/admin/products');
    })
    .catch((err) => {
        console.log(err);
    });

}



exports.getProducts = (req,res,next)=>{
    req.user.getProducts()
    .then((products)=>{
        res.render('admin/products',{
            prods: products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
        });
    }).catch((err) => {
        console.log(err);
    });
};
