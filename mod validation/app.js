
const path = require('path');

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //we are using session like this because coneect-mongodb-session is giving us func in which we will pass our session
const csrf = require('csurf');
const flash = require('connect-flash');
// const mongoConnect = require('./util/database').mongoConnect;
const multer = require('multer');

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://bilalshehroz420:00000@cluster0.wru7job.mongodb.net/shop?retryWrites=true&w=majority'
const app = express()
//creating store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        // console.log('rrrrrr');
        // const date = new Date().toLocaleDateString().split('/').join('-');
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, date + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const Error = require('./controllers/error');
const user = require('./models/user');
// const { error, log } = require('console');

app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(multer({ storage: fileStorage, fileFilter:fileFilter}).single('image'))//parsing image
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
    //it means that cookie also contaion senitive info but on the server every time it is check by session id and signayure that data is not changed 
    session({ secret:'my secret', 
    resave: false, 
    saveUninitialized: 
    false, store: store 
}) //using our store where this session will be store

)

app.use(csrfProtection) // csarf librarar has been deprecated we will use other
app.use(flash());
app.use((req,res,next)=>{
    //this local is use to set localvariviable in every renderresponse/middleware/routes which is going to use 
    //this local func is provided by express 
    //local because they exist in only those views which are going to render
    // console.log(req.session.isLoggedIn);
    res.locals.isAuthenticated =  req.session.isLoggedIn,
    res.locals.csrfToken =  req.csrfToken();
    // console.log(req.session.isLoggedIn)
    // console.log(res.locals);
    next();
})
app.use((req,res,next)=>{
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then((user) => {
        // throw new Error('dum')
        // console.log(user);
        if (!user) {
            return next()
        }
        req.user = user;
        // throw new Error('dum')
        next();
    }).catch((err) => {
        next(new Error(err))
    });
})



app.use('/admin',adminRoutes); //filter at /admin
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',Error.get500);
app.use(Error.get404);

// another type middleware  use to render errors
app.use((error,req,res,next)=>{
    // res.status(error.httpStatusCode).render('500')
    // res.redirect('/500')
    // console.log('hello');
    // console.log(req.session.isLoggedIn);
    // console.log(res.locals);
    res.status(500).render('500',{
        pageTitle: 'Error', 
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      })
})

mongoose.connect(MONGODB_URI)
.then((result) => {
    console.log("connected!");
    app.listen(3000)
})
.catch((err) => {
    console.log(err);
});

