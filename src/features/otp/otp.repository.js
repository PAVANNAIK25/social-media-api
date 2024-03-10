import { OtpModel } from './otp.schema.js';
import { UserModel } from '../users/authentication/user.repository.js';
import ApplicationError from '../../error handle/applicationError.js';
import { generateOtp, hashOtp } from '../utils/secureOTP.js';
import { sendOtp } from '../utils/sendOtp.js';
import { hashedPass } from '../utils/passwordHash.js';

export default class OtpRepository {

// this methods sends OTP to user via email
    async sendOtp(email) {
        const otp = generateOtp(); // generates 6 digit otp
        const otpExpire = new Date();
        otpExpire.setMinutes(otpExpire.getMinutes() + 10); //this will set the otpExpires in 10 mins 
        try {
            const hashedOtp = await hashOtp(otp); //hashes OTP
            const newOtp = new OtpModel({
                email: email,
                otp: hashedOtp,
                otpExpire: otpExpire
            });
            await newOtp.save();
            const result = await sendOtp(email, otp);
            if(result){
                return {
                    message: `OTP sent to ${email}`
                }
            }
            return {
                message: 'Something went wrong, please try again.'
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with OTP", 500);
        }
    }
    // this method verifies the submited OTP
    async verifyOtp(email, otp) {
        try {
            const hashedOtp = await hashOtp(otp); //return a hashed OTP/ OTP token
            const result = await OtpModel.findOne({ email: email, otp: hashedOtp });
            if(!result){
                return {
                    success: false,
                    message: "Invalid OTP!"
                }
            }
            if (result.otpExpire < new Date()) {
                return {
                    success: false,
                    message: "OTP expired!"
                }
            } else {
                return {
                    success: true,
                    message: "OTP verified!",
                    token: hashedOtp
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async resetPassword(token, newPassword){
        try{
            const result = await OtpModel.findOne({otp: token});
            const user = await UserModel.findOne({email: result.email})
            if(!user){
                return {
                    success: false,
                    message: "User not found!"
                }
            }
            const hashedPassword = await hashedPass(newPassword);
            user.password = hashedPassword;            
            await user.save();
            await OtpModel.deleteOne({otp: token});
            return{
                success: true,
                message: "Password updated successfully"
            }

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }

    }
}
