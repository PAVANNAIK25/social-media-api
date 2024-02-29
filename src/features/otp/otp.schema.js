import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: Number,
        required: true
    },
    otpExpire:{
        type: Date,
        required: true
    }
})

export const otpModel = mongoose.model('OTP', otpSchema);