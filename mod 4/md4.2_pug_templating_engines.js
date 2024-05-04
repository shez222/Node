//app.js  //ya do cheez add kari ha templating engine initialize karana ka liya
app.set('view engine','pug');
app.set('views','views'); 

//
router.get('/',(req,res,next)=>{
    // console.log(req.method);
    console.log('shop',adminData.products);
    // res.sendFile(path.join(rootdir,'views','shop.html')) //ya remove kiya or render lagaya
    res.render('shop')//this is templating dynamic pages we didn't give any static path
 });

 //pug file or our dynamic minimal html page
//  doctype html
// html(lang="en")
//     head
//         meta(charset="UTF-8")
//         meta(name="viewport", content="width=device-width, initial-scale=1.0")
//         title Shop 
//         link(rel="stylesheet", href="/css/main.css")
//         link(rel="stylesheet", href="/css/product.css")
//     body
//         header.main-header
//             nav.main-header__nav
//                 ul.main-header__item-list
//                     li.main-header__item
//                         a.active(href="/") Shop
//                     li.main-header__item
//                         a(href="/admin/add-product") Add Product

//         main
//             h1 My Products 
//             p List of all the products...

//same pug goes for add product and 404