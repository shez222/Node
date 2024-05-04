// const http = require('http'); //no need when usin app.listen()by express
const path = require('path');

const express = require('express'); //express is 3rd party package
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const app = express()
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//sql db example
// const db = require('./util/database');
// db.execute('SELECT * FROM products')
// .then(result=>{
//     console.log(result[0],result[1]);
// })
// .catch(err=>{
//     console.log(err);
// }); 


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


app.use(bodyParser.urlencoded({extended:false}));//parsing
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user) => {
        req.user = user;
        next();
    }).catch((err) => {
        console.log(err);
    });
});
app.use('/admin',adminRoutes); //filter at /admin
app.use(shopRoutes);
app.use(control404.notFoundPage);
//--------------------------------------------------------
//belongsto 1:1 or M:1
// example
// Address.belongsTo(User); // Adds userId(as foreign key) to Address model
// getAssociatedModel() => user.getAddress();
// setAssociatedModel(instance)=> user.setAddress(addressInstance);
// createAssociatedModel(values)=> user.createAddress({ /* values */ });
Product.belongsTo(User,{constraints: true, onDelete:'CASCADE'}) // Adds userId(as foreign key) to Product model  //onDelete: when a user is deleted than products which offer or created by user will also deleted
Order.belongsTo(User); // Adds userId(as foreign key) to Order model
Cart.belongsTo(User); // Adds userId(as foreign key) to Cart model
//--------------------------------------------------------------------
//hasone 1:1 
//belongsto and has many are same but there aloocation of foreign key is different
// example
// User.hasOne(Profile); // Adds userId to Profile model
// getAssociatedModel() => user.getProfile();
// setAssociatedModel(instance) => user.setProfile(profileInstance);
// createAssociatedModel(values) => user.createProfile({ /* values */ });
User.hasOne(Cart); // Adds userId to Cart model
//-------------------------------------------------------------
//hasMany 1:M
// example
//User.hasMany(Post);
// getAssociatedModels() => user.getPosts();
// setAssociatedModels(instances) => user.setPosts([postInstance1, postInstance2]);
// addAssociatedModel(instance, options) => user.addPost(postInstance, { through: { /* additional attributes */ } });
// removeAssociatedModel(instance)=> user.removePost(postInstance); 
// createAssociatedModel(values, options) => user.createPost({ /* values */ }, { /* options */ });
User.hasMany(Product); //Adds userId to Product model
User.hasMany(Order);  //Adds userId to Order model
//-----------------------------------------------------------
//N:M
//as we know that we add cart item as in b/w model in poduct and cart in many many rel thats why we are using through to to provide extra fied in cart item model
// example
// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });
// getAssociatedModels() =>  user.getProjects();
// setAssociatedModels(instances) => user.setProjects([projectInstance1, projectInstance2]);
// addAssociatedModel(instance, options) => user.addProject(projectInstance, { through: { role: 'admin' } });
// removeAssociatedModel(instance) => user.removeProject(projectInstance);
// createAssociatedModel(values, options) => user.createProject({ /* values */ }, { through: { role: 'member' } });
//add cartId and productId in cartItem
Cart.belongsToMany(Product , {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
//add orderId and productId in cartItem
Product.belongsToMany(Order ,{through: OrderItem});
Order.belongsToMany(Product ,{through: OrderItem});

sequelize.    
// sync({force : true}) 
sync()                  //sync takes all models and makes table for them  //{force : true} is used when we are updateing our complete table adding field or somthing this will delete all data present after update
.then(result=>{
    return User.findByPk(1);
})
.then((user)=>{
    if (!user) {
        return User.create({name:'Max' , email: 'sombody@.com'});
    }
    return user;

})
.then(user=>{
    console.log(user);
    return user.createCart()
})
.then(cart=>{
    // console.log(user);
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})



