import crypto from 'crypto';

export const generateOtp = ()=>{
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

export const hashOtp = async(otp) =>{
    const hashedOTP = crypto.createHash('sha256', process.env.PASSWORD_SECRET).update(otp.toString()).digest('hex');
    return hashedOTP;
}