import nodemailer from 'nodemailer';
import { otpModel } from './otp.schema.js';
import { UserModel } from '../users/authentication/user.repository.js';
import ApplicationError from '../../error handle/applicationError.js';

const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export default class OtpRepository {
    async sendOtp(email) {
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const otpExpire = new Date();
        otpExpire.setMinutes(otpExpire.getMinutes() + 10); // this will set the time otpExpire for 10 mins ahead

        try {
            const newOtp = new otpModel({
                email: email,
                otp: otp,
                otpExpire: otpExpire
            });
            await newOtp.save();

            const result = await transpoter.sendMail({
                from: "pavantest25@gmail.com",
                to: email,
                subject: "OTP for Postaway",
                html: '<p>Please use below OTP to reset your password <br></br><h2 style="margin-left:60px"><b>' + otp + '</b></h2><br></br></p> <div>This OTP is only valid for 10 minutes</div>'
            });

            return {
                message: `OTP sent to ${email}`
            }

        } catch (err) {
            console.log(err);
        }
    }

    async verifyOtp(email, otp) {

        try {
            const result = await otpModel.findOne({ email: email, otp: otp });
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
                    message: "OTP verified!"
                }
            }

        } catch (err) {
            console.log(err);
        }
    }

    async resetPassword(email, newPassword){
        try{
            const user = await UserModel.findOne({email: email});
            if(!user){
                return {
                    success: false,
                    message: "User not found"
                }
            }

            user.password=newPassword;
            await user.save();
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
