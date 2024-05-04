// const http = require('http'); //no need when usin app.listen()by express
const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');

const app = express()

const adminRoutes = require('./routes/admin'); //line no 7 or 8 ko agay peecha karna sa tab farq nahin para ga jab ham na middlware kasath method likha hua hoga agr method kijaga .use hua to 7 or 8 ki position change karna sa farq parenga
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:true}));//parsing

app.use('/admin',adminRoutes); //filtering by /admin
app.use(shopRoutes);
app.use((req,res,next)=>{
  res.status(404).send('<hi>Page Not found</hi>')
});


app.listen(3000);

