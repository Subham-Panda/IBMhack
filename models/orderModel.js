var mongoose = require("mongoose")

var OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Order must have a name'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'A Order must have a quantity'],
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

module.exports = mongoose.model("Order",OrderSchema);