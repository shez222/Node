// const http = require('http'); //no need when usin app.listen()by express
const path = require('path');

const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const app = express()
const db = require('./util/database');


//hbs
// app.engine('hbs', expressHbs({layoutDir: '/views/layout/', defaultLayout: 'main-layout' , extname: 'hbs'}));
// app.set('view engine','hbs');
//pug
// app.set('view engine','pug');
//ejs
app.set('view engine', 'ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin'); //line no 7 or 8 ko agay peecha karna sa tab farq nahin para ga jab ham na middlware kasath method likha hua hoga agr method kijaga .use hua to 7 or 8 ki position change karna sa farq parenga
const shopRoutes = require('./routes/shop');
const control404 = require('./controllers/error');

// db.execute('SELECT * FROM products')
// .then(result=>{
//     console.log(result[0],result[1]);
// })
// .catch(err=>{
//     console.log(err);
// }); 

app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes); //filter at /admin
app.use(shopRoutes);
app.use(control404.notFoundPage);


app.listen(3000);

