const express = require('express'); 
 const app = express()

app.use('/', (req,res,next)=>{
    console.log('always learn');
    next();
});
app.use('/add-p',(req,res,next)=>{
    console.log('1 middleware ss');
    res.send('<h1>add-p</h1>');
});
 app.use('/',(req,res,next)=>{
     console.log('2 middleware ss');
     res.send('<h1>hello from express!</h1>');
 });
app.listen(3000);

