const http = require('http') //importing libraray

const server = http.createServer((req,res)=>{
    // console.log(req); //req object
    console.log(req.url,req.headers,req.method);
    res.writeHead(200); //flaf for succesful request
    res.end("hello,this is node");
    // process.exit();   quiiit server can not be able to server any more
})

server.listen(3000,()=> {
    console.log("server is running on 3000 port");
}) //func listen req of user
