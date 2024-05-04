
const fs = require('fs');
const requestHandler = (req,res) => {
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
       const body = [];
       req.on('data',(chunk)=>{
           // console.log(chunk);
           body.push(chunk);
       })
       return req.on('end',()=>{  //ya return async ko avoid karna ka liya ha taka sys is linne ko execute kara naka 42 ko
           const parsedBody = Buffer.concat(body).toString();
           const message = parsedBody.split('=')[1];

           fs.writeFile('message.txt',message,(err)=>{
               res.statusCode = 302;
               res.setHeader('Location','/');
               return res.end();
           })

       })

   }

   res.setHeader('Content-Type','text/html');
   res.write('<html>')
   res.write('<head><title>my first page</title></head>')
   res.write('<body><h1>hello this is node</h1></body>')
   res.write('</html>')
   res.end()
   // process.exit();   quiiit server can not be able to access server any more

}
//different way to export modules

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'hello'
// }

// module.exports.handler = requestHandler;
// module.exports.someText = 'hello';

exports.handler = requestHandler;
exports.someText = 'hello';
