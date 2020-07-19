const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = async (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: req.secure || req.headers('x-forwarded-proto') === 'https',
    });

    //Remove password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        contactNumber: req.body.contactNumber,
        about: req.body.about,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body; //using the power of es6 destructuring
    //the above is same as writing const email = req.body.email; const password = req.body.password

    //1)Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //2)Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    //+ is used to select field if it is not selected by default
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3)If everything ok, send token to client
    createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
    //1) Get token and check if its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    console.log(token);
    console.log("abc");
    if (!token)
        return next(
            new AppError(
                'You are not logged in! Please Login to get access',
                401
            )
        );

    //2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //decoded will be the payload of the JWT

    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to the token no longer exists',
                401
            )
        );
    }

    //4) Check if user change password after JWT was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password. Please Log in again',
                401
            )
        );
    }

    //5)Grant access to protected route
    req.user = currentUser; //storing because it will used during authorization
    next();
});

//Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    //1) Get token and check if its there
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            //decoded will be the payload of the JWT

            //3) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            //4) Check if user change password after JWT was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            //5)THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles is an array , i.e in this case ['admin']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this', 403)
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1)Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    //2)Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        //3) Send it to user's email
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/api/users/resetPassword/${resetToken}`;
        //const resetUrl = `url with reset token ${resetToken}`;
        await new Email(user, resetUrl).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.createPasswordResetToken = undefined;
        user.createPasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email. Try again!!',
                500
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    //2)Set the new password if the token has not expired and there is a user
    if (!user) {
        return next(new AppError('Token is Invalid or has Expired', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3) Update to changedPasswordAt property for the user.
    // Pre save hook defined for this

    //4) Log the user in. Send JWT
    createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    //2) Check if posted password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Your current password is wrong', 401));
    }

    //3) If so, update the password
    user.password = req.body.password;
    await user.save();
    //User.findByIdAndUpdate will NOT work as intended. Cause in that case the hooks defined for save wont be executed and also the validator functions for passwords also wont run as they work only for create and save.

    //4) Log user in with new password
    createSendToken(user, 200, req, res);
});
