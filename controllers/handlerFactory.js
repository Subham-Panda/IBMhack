const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIfeatures = require('../utils/APIfeatures');
const Product = require('../models/productModel');
const Service = require('../models/serviceModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        // const newDoc = new Model({});
        // newDoc.save();

        const newDoc = await Model.create(req.body);
        
        if(Model === Product)
        {
            req.user.products.push(newDoc._id);
            await req.user.save();
        }
        if(Model === Service)
        {
            req.user.services.push(newDoc._id);
            await req.user.save();
        }
        if(Model === Order)
        {
            newDoc.seller = req.params.id;
            newDoc.buyer = req.user._id;
            await newDoc.save();
            req.user.ordersGiven.push(newDoc._id);
            await req.user.save();
            let query = User.findById(req.params.id);
            const doc = await query;
            doc.ordersReceived.push(newDoc._id);
            await doc.save();

        }
        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        //Model.findById is short hand for Model.findOne({_id: req.params.id})
        if (popOptions) query = query.populate(popOptions);

        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const features = new APIfeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        //EXECUTE query
        const doc = await features.query;
        //const doc = await features.query.explain();
        //explain() methods on a query gives us a lot of stats about the query

        //SEND response
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
