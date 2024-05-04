const User = require('../models/user');

exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1]
    // console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login Page',
        isAuthenticated: false
    });
 };

 exports.postLogin = (req,res,next)=>{
    User.findById('6591e2acd356de9319c017ec')
    .then((user) => {
        // console.log(user);
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err)=>{ 
            // console.log(err);
            res.redirect('/');
        })
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
