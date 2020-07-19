var mongoose = require("mongoose")

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Product must have a name'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
    },
    stock: String,
    image: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})
module.exports = mongoose.model("Product",ProductSchema);
