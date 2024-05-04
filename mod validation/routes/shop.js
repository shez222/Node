const path = require('path')

const express = require('express');

const rootdir = require('../util/path');

const adminData = require('./admin')

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProduct) //dynamic path or route variable after semicolon is dynmamic data (/products/:productId) productId is dynamic

// // // router.get('/products/delete') //if we have  static(/products/delete') and dynamic rouute(/products/:productId') whose initiating characters are same then static route should be return first then dynamic 

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postDeleteCartProduct)

router.get('/checkout',shopController.getCheckout);

router.get('/checkout/success',shopController.getCheckoutSuccess)

router.get('/checkout/cancel',shopController.getCheckout)

// router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);




module.exports = router;