const path = require('path');

const express = require('express');

const rootdir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');


//full url /admin/add-product but filtered in main
///admin/add-product=>using GET
router.get('/add-product', isAuth, adminController.getAddProducts); //as we know that routes travel from left to right so 1st it will check isAuth than next given root too its left
///admin/products=>using GET
router.get('/products', isAuth, adminController.getProducts);
///admin/add-product=>using POST
router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, adminController.postEditProducts);

router.post('/delete-product', isAuth, adminController.postDeleteProduct)



// module.exports = router;
module.exports = router

//we can initialize same route to diff middleware but diff method