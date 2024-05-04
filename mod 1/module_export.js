const http = require('http'); //importing libraray
const routes = require('./routes')

const server = http.createServer(routes.handler) //routes.handler use like this when exporting an object in which multiple key value pairs are defined
console.log(routes.someText);
server.listen(3000,()=> {
    console.log("server is running on 3000 port");
}) //func listen req of user