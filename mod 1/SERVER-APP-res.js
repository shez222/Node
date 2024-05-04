// const http = require('http') //importing libraray

// const server = http.createServer((req,res)=>{
//     // console.log(req); //req object
//     console.log(req.url,req.headers,req.methods);
//     res.writeHead(200); //flaf for succesful request
//     res.end("hello,this is node");
//     // process.exit();   quiiit server can not be able to server any more
// })

// server.listen(3000,()=> {
//     console.log("server is running on 3000 port");
// }) //func listen req of user
//response
const http = require('http') //importing libraray

const server = http.createServer((req,res)=>{
    // console.log(req); //req object
    console.log(req.url,req.headers,req.method);
    res.setHeader('Content-Type','text/html');
    res.write('<html>')
    res.write('<head><title>my first page</title></head>')
    res.write('<body><h1>hello this is node</h1></body>')
    res.write('</html>')
    res.end()
    // process.exit();   quiiit server can not be able to server any more
})

server.listen(3000,()=> {
    console.log("server is running on 3000 port");
}) //func listen req of user