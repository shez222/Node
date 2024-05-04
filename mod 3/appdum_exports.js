// const http = require('http'); //no need when usin app.listen()by express
const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');

const app = express()

const adminRoutes = require('./routes/admin'); //line no 7 or 8 ko agay peecha karna sa tab farq nahin para ga jab ham na middlware kasath method likha hua hoga agr method kijaga .use hua to 7 or 8 ki position change karna sa farq parenga
const shopRoutes = require('./routes/shop');
//  app.use((req,res,next)=>{
//      console.log('in middleware');
//      next() //allow the req to continue to next mw inline
//  });
app.use(bodyParser.urlencoded({extended:true}));//parsing

app.use(adminRoutes);
app.use(shopRoutes);

/*now we will export this
// app.use('/add-product',(req,res,next)=>{
//     //console.log(req.method);
//     res.send('<form action="/product" method="POST" ><input type="text" name="title"><button type="submit">add product</button></form>');
// });
// app.post('/product', (req,res,next)=>{
//     console.log(req.method);
//     console.log(req.body); //parsing to use this func to print body
//     res.redirect('/');

// });
//  app.use('/',(req,res,next)=>{
//     // console.log(req.method);
//     res.send('<h1>hello from express!</h1>');
//  });*/
app.listen(3000);

//now we don,t need hhtp package to create server express will do all below things with app.listen()
// const server = http.createServer(app) 
// server.listen(3000);