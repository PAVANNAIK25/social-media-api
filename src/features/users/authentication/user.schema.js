import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    gender: {
        type: String,
        default: 'unknown'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }],
    sessions: [String],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friend'
        }
    ]

})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();

});

userSchema.methods.verifyPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
    const token = await jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
    this.sessions.push(token);
    return token;
}

export const UserModel = mongoose.model('User', userSchema);