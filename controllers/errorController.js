const AppError = require('../utils/AppError');

const sendErrorDev = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    //RENDERED WEBSITE
    console.log('ERROR:::', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
    });
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/"([^"]*)"/g);
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid Input Data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Inavlid Token. Please Login again', 401);

const handleJWTExpiredError = () =>
    new AppError('Token has Expired. Please Login again', 401);

const sendErrorProd = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
        //Operational Error; trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.message,
                message: err.message,
            });
        }

        //Programming or other unknown error: don't leak error details
        //1) Log error
        console.error('ERROR:::', err);

        //2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    //RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message,
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
