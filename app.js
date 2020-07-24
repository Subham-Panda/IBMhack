const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser')


const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

//Start express app
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARES

app.use(cors());
app.use(helmet());
app.options('*',cors());
app.use(cookieParser());
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));


//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //the option given as object limits data in the req body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//ROUTES
app.use('/api/users', userRouter);
app.use('/',viewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
//On passing argument into next function in express, it automatically goes to the error handler function considering the argument of th next function as the error

app.use(globalErrorHandler);
//error handler function has 4 arguments as input

//Exporting the express app
module.exports = app;
