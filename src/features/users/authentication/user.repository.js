import { UserModel } from './user.schema.js'
import ApplicationError from '../../../utils/error handle/applicationError.js';
import { sendEmail } from '../../../utils/sendEmail.js';
import crypto from 'crypto';


export default class UserRepository {
    
    //this method will allow users to sign up
    async signUp(userData) {
        if(userData.role){
            userData.role = userData.role.toUpperCase();
        }
        const newUser = new UserModel(userData);
        await newUser.save();
        return await UserModel.findById(newUser._id).select('name email role gender');
    }

    // this will ensure the valid sign in process
    async signIn(email, password) {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        const result = await user.verifyPassword(password);
        if (result) {
            const token = await user.generateAccessToken();
            await user.save();
            return {
                success: true,
                message: "Login Successful",
                token: token
            };
        } else {
            throw new ApplicationError("Invalid credentials", 400);
        }
    }

    // this method will send a reset token via email

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        const {unHashedToken, hashedToken, tokenExpiry} = await user.generateTemporaryToken();

        user.forgotPasswordToken = hashedToken;
        user.forgotPasswordExpiry = tokenExpiry;
        await user.save({validateBeforeSave: false});
        const token = unHashedToken;
        const result = await sendEmail(email, token);
        return result;
        
    }

    // this method will accept token and new password. If token is valid this will set the new password 
    async resetPassword(newPassword, token){
        let hashedToken = crypto.createHash('sha256').update(token).digest('hex');    
        const user = await UserModel.findOne({forgotPasswordToken: hashedToken, forgotPasswordExpiry: {$gt: new Date()}});
        if (!user) {
            throw new ApplicationError("Invalid or expired token ", 400);
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        user.password = newPassword;
        await user.save();
        return true;

    }

    // this method will logout from the current device or session
    async logout(userId, token) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        const result = await user.clearSession(token);
        await user.save();
        if (!result) {
            return { success: false };
        }
        return {
            success: true,
            message: "You have been successfully logged out"
        }

    }

    // this method will logout from all devices or sessions
    async logoutAllDevices(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found", 400);
            }
            user.sessions = [];
            await user.save();
            return {
                success: true
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }
}