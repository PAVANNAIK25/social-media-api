import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ProfileModel } from "../profile/profile.schema.js";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: 'USER'
    },
    gender: {
        type: String,
        default: 'unknown'
    },
    sessions: [String],
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    }

},
    { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hash(this.password, 12);
    next();

});

userSchema.post('save', async function(user, next){
    const socialProfile = await ProfileModel.findOne({owner: user._id});
    if(!socialProfile){
        await ProfileModel.create({owner: user._id});
    }
    next();
})

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    this.sessions.push(token);
    return token;
}

userSchema.methods.clearSession = async function (token) {
    if (this.sessions.includes(token)) {
        const index = this.sessions.findIndex(i => token === i);
        this.sessions.splice(index, 1);
        return true;
    }
    return false;
}

export const UserModel = mongoose.model('User', userSchema);