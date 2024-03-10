import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    otpExpire:{
        type: Date,
        required: true
    }
})

export const OtpModel = mongoose.model('OTP', otpSchema);