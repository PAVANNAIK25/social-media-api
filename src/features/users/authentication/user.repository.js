import { UserModel } from './user.schema.js'
import ApplicationError from '../../../utils/error handle/applicationError.js';


export default class UserRepository {

    async signUp(userData) {
        userData.role = userData.role.toUpperCase();
        const newUser = new UserModel(userData);
        await newUser.save();
        return await UserModel.findById(newUser._id).select('name email role gender');
    }

    async signIn(email, password) {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
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
            // return { success: false,
            //         message: "Invalid credentials" };
            throw new ApplicationError("Invalid credentials", 400);
        }
    }

    async logout(userId, token){
        const user  = await UserModel.findById(userId);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        const result = await user.clearSession(token);
        await user.save();
        if(!result){
            return { success: false };
        }
        return {
            success: true,
            message: "You have been successfully logged out"
        }

    }

    async logoutAllDevices(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found", 400);
            }
            user.sessions = [];
            await user.save();
            return {
                success:true
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }
}