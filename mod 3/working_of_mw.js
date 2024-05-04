const http = require('http'); 

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
const server = http.createServer(app) 
server.listen(3000);