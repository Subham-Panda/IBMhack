var mongoose = require("mongoose")

var ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Service must have a name'],
        trim: true,
    },
    rate: {
        type: Number,
        required: [true, 'A service must have a rate charge'],
    },
    image: String,
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

module.exports = mongoose.model("Service",ServiceSchema);


// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'A Service must have a name'],
//         trim: true,
//     },
//     provider: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: [true, 'Each service must have a provider'],
//     },
//     image: {
//         type: String,
//     },
//     rate: {
//         type: String,
//         required: [true, 'A service must have a rate charge'],
//     },
//     ratingsAverage: {
//         type: Number,
//         default: 0,
//         min: [1, 'Rating must be above 1.0'],
//         max: [5, 'Rating must be below 5.0'],
//         set: (val) => Math.round(val * 10) / 10,
//         //set receives a callback functions which run each time a new value is received for the field
//     },
//     ratingsQuantity: {
//         type: Number,
//         default: 0,
//     },
// });

// const Service = mongoose.model('Service', serviceSchema);

// module.exports = Service;
