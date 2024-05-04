
const path = require('path');

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const app = express()

app.set('view engine', 'ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const control404 = require('./controllers/error');
const user = require('./models/user');

app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findById('6591e2acd356de9319c017ec')
    .then((user) => {
        // console.log(user);
        req.user = user;
        next();
    }).catch((err) => {
        console.log(err);
    });
})
app.use('/admin',adminRoutes); //filter at /admin
app.use(shopRoutes);
app.use(control404.notFoundPage);


mongoose.connect('mongodb+srv://bilalshehroz420:00000@cluster0.wru7job.mongodb.net/shop?retryWrites=true&w=majority')
.then((result) => {
    User.findOne().then(user=>{
        if (!user) {
            const user = new User({
                name: 'user1',
                email: 'user1@.com',
                cart:{
                    items:[]
                }
            });
            user.save();
        }
    });
    console.log("connected!");
    app.listen(3000)
})
.catch((err) => {
    
});