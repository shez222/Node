const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.urlencoded({extended:true}));//parsing
app.get('/add-product',(req,res,next)=>{
    //console.log(req.method);
    res.send('<form action="/product" method="POST" ><input type="text" name="title"><button type="submit">add product</button></form>');
});
app.post('/product', (req,res,next)=>{
    console.log(req.method);
    console.log(req.body); //parsing to use this func to print body
    res.redirect('/');

});
app.use('/',(req,res,next)=>{
    // console.log(req.method);
    res.send('<h1>hello from express!</h1>');
 });
app.listen(3000);

//get and post and other methods of http can be write for diff middlewares

