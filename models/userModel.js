const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'User must have an email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactNumber: {
        type: Number,
        required: [true, 'User must have a phone number'],
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false, //password will not be sent in output anymore
    },
    about: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    ordersGiven: [{type: mongoose.Schema.Types.ObjectId,ref: "Order" }],
    ordersReceived: [{type: mongoose.Schema.Types.ObjectId,ref: "Order"}],
});

userSchema.pre('save', async function (next) {
    //Only run this function if the password was actually modified
    if (!this.isModified('password')) return next();

    //hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function (next) {
    //this points to the current query because this is query middleware
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return changedTimeStamp > JWTTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
