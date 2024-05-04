const http = require('http'); //importing libraray
const fs = require('fs');

const server = http.createServer((req,res)=>{
    // console.log(req); //req object

    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>ENter Message</title></head>');
        res.write('<body><form action = "/message" method = "POST"><input type = "text" name = "message"><button type = "submit">Send</button></form></body>')
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method==='POST') {
        fs.writeFileSync('message.txt','DUMMY');
        
        //redirecting requests
        res.statusCode = 302;
        res.setHeader('Location','/');
        // res.writeHead(302,{'Location':'/'}); //redirectin aisa bhi karsakta
        return res.end();
    }
    // console.log(req.url,req.headers,req.method);
    res.setHeader('Content-Type','text/html');
    res.write('<html>')
    res.write('<head><title>my first page</title></head>')
    res.write('<body><h1>hello this is node</h1></body>')
    res.write('</html>')
    res.end()
    // process.exit();   quiiit server can not be able to access server any more
})

server.listen(3000,()=> {
    console.log("server is running on 3000 port");
}) //func listen req of user