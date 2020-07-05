const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    contactNo: Number,
    mail: String,
    about: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    ordersGiven: [
        {
            isProduct: { type: Boolean, default: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            isCompleted: { type: Boolean, default: false },
        },
    ],
    ordersReceived: [
        {
            isProduct: { type: Boolean, default: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
            buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            isCompleted: { type: Boolean, default: false },
        },
    ],
});
module.exports = mongoose.model('User', UserSchema);
