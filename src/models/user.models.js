import moongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema(
    {
        avatar: {
           url:{
                type: String,
                default: 'https://placehold.co/600x400',
            },
            localpath: {
                type: String,
                default: '',
           }
        },
       
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: {
            type: Boolean,
            default: false,
        },
        forgotPasswordExpiry: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (currPassword) {
    return await bcrypt.compare(currPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
};

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};


userSchema.methods.generateTemporaryToken = function () {

    const unhashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.
        createHash("sha256")
        .update(unhashedToken).digest("hex");

    const tokenExpiry = Date.now() + (20 * 60 * 1000); // 20 minutes

    return {
        unhashedToken,
        hashedToken,
        tokenExpiry,
    }
}


export const USER = moongoose.model('USER', userSchema);
