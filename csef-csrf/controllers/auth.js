const User = require('../models/user');
const bcrypt = require('bcryptjs'); //libraray for encryption

const nodemailer = require('nodemailer');  //depsendencie to send email how  your email going to deliverde to address
const sendridTransporter = require('nodemailer-sendgrid-transport'); //third party package through it will transfer


exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1]
    // console.log(req.session.isLoggedIn);
    let message = req.flash('error')
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login Page',
        errorMessage: message
    });
 };

 exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then((user) => {
        // console.log(user);
        if (!user) {
            req.flash('error','Invalid User')
            return res.redirect('/login');
        }
        bcrypt
            .compare(password,user.password) //compare password will always return boolean true or false and it will give a promis in which it returns taht boolean
            .then((doMatch) => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err)=>{ 
                    // console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error','Invalid Password')
            res.redirect('/login')

            }).catch((err) => {
                console.log(err);
                res.redirect('/login')
            });
    }).catch((err) => {
        console.log(err);
    });
   
 }

 exports.postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/')
    })
   
 }
 exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
    });
  };

 exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})  //finding user
    .then((userDoc) => {
        if (userDoc) {
            req.flash('error','Email alredy exist')
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12) //encrypt password and then saving in db
        .then((hashedPassword)=>{
            const user = new User({   //creating user
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save();
        })
        .then((result)=>{
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'bilal.shehroz420@gmail.com',
                subject: 'Signup Suceeded',
                html: '<h1>Sucessfull Signedup....</h1>'
            })
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch((err) => {
        console.log(err);
    });
 };

 exports.getReset = (req,res,next)=>{
    let message = req.flash('error')
    if (message.length > 0 ) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message
    });
 }

//another pakage
//  const sgMail = require('@sendgrid/mail')
//  sgMail.setApiKey('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')
//  sgMail.send({
//     to: email,
//     from: 'bilal.shehroz420@gmail.com',
//     subject: 'Signup Suceeded',
//     html: '<h1>Sucessfull Signedup....</h1>'
// })




 //-----------cookie
//  exports.postLogin = (req,res,next)=>{
//     // req.isLoggedIn = true;
//     // res.redirect('/');  //redirection create brand new request all time it means when we register is login field the data will be gone after redirection in next line
// // it's prevention is that we can use cookie to set each req from  users to save on their browser browser 
//     res.setHeader('Set-Cookie','loggedIn=true');  //this cookies can be manipulated  inside the browser
//     res.redirect('/');
// //we don't store sensitive data in cookie as we see above that it cookies can be manipilated at users browsers
// };
// //diff method can be send with res.setHeader('Set-Cookie','loggedIn=true; methods'); like 
// // secure:only create cookie when https req
// //httpOnly: when http
// //expires: cookie expires date set in some http format
// //Max-Age:same as expire take time in sec 
// //if we did'nt use expire cookie will expires whwn browser is closed
// //Domain:to whom cookie will be sennt

// //we implement the session to overcome the manipulation
// //session is works on server side it will store references of sensitive data within..
// // database with id which is encrypted and sent on users sides coookie 
