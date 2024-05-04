//app.js
// const http = require('http'); //no need when usin app.listen()by express
const path = require('path');

const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');

const app = express()

const adminRoutes = require('./routes/admin'); //line no 7 or 8 ko agay peecha karna sa tab farq nahin para ga jab ham na middlware kasath method likha hua hoga agr method kijaga .use hua to 7 or 8 ki position change karna sa farq parenga
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes.routes); //filter at /admin
app.use(shopRoutes);
app.use((req,res,next)=>{
  res.status(404).sendFile(path.join(__dirname,'views','page_404.html'));
});


app.listen(3000);

//admin.js
const path = require('path');

const express = require('express');

const rootdir = require('../util/path');

const router = express.Router();

const product = [];

//full url /admin/add-product but filtered in main
///admin/add-product=>using GET
router.get('/add-product',(req,res,next)=>{
    // console.log(req.method);
    res.sendFile(path.join(rootdir,'views','add-product.html'))
});
///admin/add-product=>using POST
router.post('/add-product', (req,res,next)=>{
    // console.log(req.method);
    // console.log(req.body); //parsing to use this func to print body
    product.push({title:req.body.title}); //data source

    res.redirect('/');

});

// module.exports = router;
exports.routes = router;
exports.products = product;

//we can initialize same route to diff middleware but diff method

//shop.js
const path = require('path')

const express = require('express');

const rootdir = require('../util/path');

const adminData = require('./admin')

const router = express.Router();

router.get('/',(req,res,next)=>{
    // console.log(req.method);
    console.log('shop',adminData.products);  //printing here sharing data
    res.sendFile(path.join(rootdir,'views','shop.html'))
 });

module.exports = router;