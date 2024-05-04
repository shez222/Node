// 
// const http = require('http');
// const server = http.createServer((req,res) => {
// const url = req.url
// if (url === '/') {
//     res.writeHead(200);
//     res.end('success')
// }
// if (url === '/users') {
//     res.write('<html>');
//     res.write('<head><title>Enter Message</title></head>');
//     res.write('<body><ul><li>user1</li></ul></body>')
//     res.write('</html>');
//     return res.end();
// }
// });
// server.listen(3000,()=>{
//     console.log('server is listeneing');
// })
// const http = require('http');
// const server = http.createServer((req,res) => {
// const url = req.url

// if (url === '/') {
//     res.write('<html>');
//     res.write('<head><title>Enter Message</title></head>');
//     res.write('<body><form action = "/create-user" method= "POST"><input type="text" name = "username"><button type = "submit">Send</button></form></body>')
//     res.write('</html>');
//     return res.end();
// }
// res.setHeader('Content-Type','text/html');
// res.write('<html>')
// res.write('<head><title>my first page</title></head>')
// res.write('<body><h1>hello this is node</h1></body>')
// res.write('</html>')
// res.end()
// });
// server.listen(3000,()=>{
//     console.log('server is listeneing');
// })

// const http = require('http');
// const server = http.createServer((req,res) => {
// const url = req.url

// if (url === '/') {
//     res.write('<html>');
//     res.write('<head><title>Enter Message</title></head>');
//     res.write('<body><form action = "/create-user" method= "POST"><input type="text" name = "username"><button type = "submit">Send</button></form></body>')
//     res.write('</html>');
//     return res.end();
// }
// if (url === '/create-user' && req.method === 'POST' ) {
//     const body = [];
//     req.on('data',(chunks)=>{
//         body.push(chunks);
//     });
//     return req.on('end',()=>{
//         const parsedText = Buffer.concat(body).toString();
//         console.log(parsedText);
//         res.writeHead(302,{'Location':'/'});
//         return res.end();
//     });
    
// }
// });
// server.listen(3000,()=>{
//     console.log('server is listeneing');
// })