// const http = require('http'); //no need when usin app.listen()by express

const express = require('express'); //express is 3rd party package
 const app = express()
 app.use((req,res,next)=>{
     console.log('in middleware');
     next() //allow the req to continue to next mw inline
 });
 app.use((req,res,next)=>{
     console.log('next middleware ss');
     res.send('<h1>hello from express!</h1>');
 });
app.listen(3000);

//now we don,t need hhtp package to create server express will do all below things with app.listen()
// const server = http.createServer(app) 
// server.listen(3000);