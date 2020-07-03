var mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    contactNo: Number,
    mail: String,
    about: String,
    products: [
        { type: mongoose.Schema.Types.ObjectId,
            ref: "Product"}
    ],
    services: [ 
        { type: mongoose.Schema.Types.ObjectId,
            ref: "Service"}
    ],
    ordersGiven: [
        {isProduct: { type:bool, default:true },                                
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},  
        service: {type: mongoose.Schema.Types.ObjectId, ref: "Service"},
        selller: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        isCompleted: { type:bool, default:false },}
    ],
    ordersReceived: [
        {isProduct: { type:bool, default:true },
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},  
        service: {type: mongoose.Schema.Types.ObjectId, ref: "Service"},
        buyer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        isCompleted: { type:bool, default:false },}
    ],
})
module.exports = mongoose.model("User",UserSchema);