const User = require('../models/user');
const bcrypt = require('bcryptjs'); //libraray for encryption
const crypto = require('crypto'); //unique secure random value
const nodemailer = require('nodemailer');  //depsendencie to send email how  your email going to deliverde to address
const sendridTransporter = require('nodemailer-sendgrid-transport'); //third party package through it will transfer
const { validationResult } = require('express-validator');
const { error } = require('console');
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
        errorMessage: message,
        oldInput: {
            email:'',
            password:'',
        },
        validationErrors: []
    });
 };

 exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let errors = validationResult(req);
    // console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg, //jo error msg hm route pir bhej raha ha wo yaha sa ja raha ha pasge par
            oldInput: {
                email:email,
                password:password,
            },
            validationErrors: errors.array()
        })
        }
    User.findOne({email:email})
    .then((user) => {
        // console.log(user);
        if (!user) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid User', //jo error msg hm route pir bhej raha ha wo yaha sa ja raha ha pasge par
                oldInput: {
                    email:email,
                    password:password,
                },
                validationErrors: [{ path: 'email'}]
            })
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
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Wrong Password', //jo error msg hm route pir bhej raha ha wo yaha sa ja raha ha pasge par
                oldInput: {
                    email:email,
                    password:password,
                },
                validationErrors: [{ path: 'password'}]
            })

            }).catch((err) => {
                console.log(err);
                res.redirect('/login')
            });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
      errorMessage: message,
      oldInput: {
        email:'',
        password:'',
        confirmPassword:'' 
      },
      validationErrors: []
    });
  };

 exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg, //jo error msg hm route pir bhej raha ha wo yaha sa ja raha ha pasge par
            oldInput: {
                email:email,
                password:password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        })
        }
        bcrypt.hash(password, 12) //encrypt password and then saving in db
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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

 exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
    if (err) {
        console.log(err);
        req.flash('error','somthing might wrong');
        res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
    .then((user) => {
        if (!user) {
            req.flash('error','No account with that email')
            return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000

        return user.save()
    })
    .then((result)=>{
        res.redirect('/')
        transporter.sendMail({
        to: req.body.email,
        from: 'bilal.shehroz420@gmail.com',
        subject: 'Signup Suceeded',
        html: `
            <p>you requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set new password</p>
        `
        })
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    })
    
 }
 exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({ resetToken: token , resetTokenExpiration:{$gt: Date.now()}})//checking date greater than creation time
    .then((user) => {
        let message = req.flash('error')
        if (message.length > 0 ) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'new-password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
          });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

 }

 exports.postNewPassword = (req,res,next)=>{
    const newPassword=req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiration:{$gt: Date.now()}, _id:userId})
    .then((user) => {
        resetUser = user;
        return bcrypt.hash(newPassword,12);
    })
    .then(hashedPassword=>{
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login')
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
