import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {userSchema} from './user.schema.js'
import ApplicationError from "../../../error handle/applicationError.js";

export const UserModel = mongoose.model('User', userSchema);
export default class UserRepository {

    async signUp(userData) {
        try {
            const newUser = new UserModel(userData);
            await newUser.save();
            return newUser;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }

    }

    async signIn(email, password) {
        try {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return {
                    success: false
                };
            }

            const result = await bcrypt.compare(password, user.password)
            if (result) {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                user.sessions.push(token);
                await user.save();
                return {
                    success: true,
                    token: token
                };
            } else {
                return { success: false };
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }

    }

    async logoutAllDevices(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found", 400);
            }
            user.sessions=[];
            await user.save();

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async logout(userId, token){
        
    }


}