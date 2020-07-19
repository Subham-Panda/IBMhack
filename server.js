const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Global uncaught exception dealer
process.on('uncaughtException', (err) => {
    console.log('UNHANDLED EXCEPTION! Shutting Down...');
    console.log(err);

    process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connections successful'));

const app = require('./app');

//Starting the SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

//Global unhandled rejection dealer
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting Down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
