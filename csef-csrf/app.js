
const path = require('path');

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //we are using session like this because coneect-mongodb-session is giving us func in which we will pass our session
// const csrf = require('csurf');
const { doubleCsrf } = require('csrf-csrf');
const flash = require('connect-flash');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://bilalshehroz420:00000@cluster0.wru7job.mongodb.net/shop?retryWrites=true&w=majority'
const app = express()
//creating store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})
// const csrfProtection = csrf();
const { doubleCsrfProtection } = doubleCsrf()

app.set('view engine', 'ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const control404 = require('./controllers/error');
const user = require('./models/user');

app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(express.static(path.join(__dirname,'public')));
app.use(
    //it means that cookie also contaion senitive info but on the server every time it is check by session id and signayure that data is not changed 
    session({ secret:'my secret', resave: false, saveUninitialized: false, store: store }) //using our store where this session will be store

)
// app.use(csrfProtection) // csarf librarar has been deprecated we will use other
app.use(doubleCsrfProtection)
app.use(flash());
app.use((req,res,next)=>{
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then((user) => {
        // console.log(user);
        req.user = user;
        next();
    }).catch((err) => {
        console.log(err);
    });
})
app.use((req,res,next)=>{
    //this local is use to set localvariviable in every renderresponse/middleware/routes which is going to use 
    //this local func is provided by express 
    //local because they exist in only those views which are going to render
    // console.log(req.session.isLoggedIn);
    res.locals.isAuthenticated =  req.session.isLoggedIn,
    res.locals.csrfToken =  req.csrfToken();
    
    next();
})
app.use('/admin',adminRoutes); //filter at /admin
app.use(shopRoutes);
app.use(authRoutes);

app.use(control404.notFoundPage);


mongoose.connect(MONGODB_URI)
.then((result) => {
    console.log("connected!");
    app.listen(3000)
})
.catch((err) => {
    console.log(err);
});

