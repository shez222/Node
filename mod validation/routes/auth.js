const express = require('express');

const authController = require('../controllers/auth');

const User = require('../models/user');

const { check,body } = require('express-validator'); //can call on req body,params,query,header,cookie
const user = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin)

router.post('/login',[
    body('email')
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
    body('password', 
    'password have to be valid'
    ) //2nd argument is error
        .isLength({min: 5})
        .isAlphanumeric()
    .trim()
    ]
    ,
    authController.postLogin
    )

router.post('/logout', authController.postLogout)

router.get('/signup',authController.getSignup);

router.post('/signup',[
    check('email')
    .isEmail()
    .withMessage('please enter valid Email')
    .custom((value,{ req })=>{
        // if (value === 'test@test.com') {
        //     throw new Error('this email is forbidden')
        // }
        // return true;

        //async validator
        //this custom validator will receive a promise in return which will confirm validation a/c to t/f
        return User.findOne({ email: value })
        .then((userDoc) => { 
            if (userDoc) {
                return Promise.reject(
                    'Email already exist'
                )
            }

        })
    })
    .normalizeEmail(),
    body('password', 
    'please enter a password only number and alphabet atleast 5 char'
    ) //2nd argument is error
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
    .custom((value,{ req })=>{
        if (value !== req.body.password) {
            throw new Error ('password have to match')
        };
        return true;
    })
    .trim()
],
    authController.postSignup);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword)

router.post('/new-password',authController.postNewPassword)

module.exports = router;