const path = require('path');
const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
//const viewRouter = require('./routes/viewRoutes');

//Start express app
const app = express();

app.set('view engine', 'ejs');
app.set('view', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARES

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//ROUTES
//app.use('/', viewRouter);
app.use('/api/users', userRouter);

//Exporting the express app
module.exports = app;
