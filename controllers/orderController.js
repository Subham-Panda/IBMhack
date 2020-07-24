const Product = require('../models/productModel');
const Service = require('../models/serviceModel');
const Order   = require('../models/orderModel');
const handler = require('../controllers/handlerFactory')

exports.createProduct=handler.createOne(Product);

exports.createService=handler.createOne(Service);

exports.allProducts=handler.getAll(Product);

exports.allServices=handler.getAll(Service);

exports.createOrder=handler.createOne(Order);
