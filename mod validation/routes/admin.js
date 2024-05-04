const path = require('path');

const express = require('express');

const rootdir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const { validate } = require('../models/user');


//full url /admin/add-product but filtered in main
///admin/add-product=>using GET
router.get('/add-product', isAuth, adminController.getAddProducts); //as we know that routes travel from left to right so 1st it will check isAuth than next given root too its left
///admin/products=>using GET
router.get('/products', isAuth, adminController.getProducts);
///admin/add-product=>using POST
router.post('/add-product', [
    body('title','Invalid Title')
    .isString()
    .isLength({ min: 3})
    .trim(),
    body('price','Invalid Price')
    .isFloat(),
    body('description','Invalid Description')
    .isString()
    .isLength({ min: 5})
    .trim()
],isAuth, adminController.postAddProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', [
    body('title','Invalid Title')
    .isString()
    .isLength({ min: 3})
    .trim(),
    body('price','Invalid Price')
    .isFloat(),
    body('description','Invalid Description')
    .isString()
    .isLength({ min: 5})
    .trim()
],isAuth, adminController.postEditProducts);

router.delete('/product/:productId', isAuth, adminController.deleteProduct)



// module.exports = router;
module.exports = router

//we can initialize same route to diff middleware but diff method