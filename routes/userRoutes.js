const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const orderController=require('../controllers/orderController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/products',orderController.allProducts);
router.get('/services',orderController.allServices);
router.get('/product/:id',orderController.findProduct)
router.get('/service/:id',orderController.findService)


router.use(authController.protect); //Since middlewares run in sequence, every route below this is protected
router.post('/product',orderController.createProduct);
router.post('/service',orderController.createService);
router.post('/order/:id',orderController.createOrder);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
    '/updateMe',
    // userController.uploadUserPhoto,
    // userController.resizeUserPhoto,
    userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin')); // Since middlewares run in sequence, a;; the routes below can be accessed only by user having admin rights

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
