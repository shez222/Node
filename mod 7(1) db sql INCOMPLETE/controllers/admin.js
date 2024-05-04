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
    const product = new Product( null,title,imageUrl,description,price);
    product.save()
    .then(()=>{
        res.redirect('/');
    }    
    )
    .catch( err=>{
        console.log(err);
    })
}

exports.getEditProducts = (req,res,next)=>{
    // console.log(req.method);
    // res.sendFile(path.join(rootdir,'views','add-product.html'))
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId
    Product.findById(prodId,product=>{
        if (!product) {
            res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:'Edit Product ', 
            path:'/admin/edit-product',
            editing:editMode, 
            product: product
        }) 
    })

}

exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}

exports.postEditProducts =(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    // console.log('reach');

    updatedProduct.save();

    res.redirect('/admin/products');


}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{
            prods:products , 
            pageTitle: 'Admin Products', 
            path:'/admin/products', 
        });
    });
};
