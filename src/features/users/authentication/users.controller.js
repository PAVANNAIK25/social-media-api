import ApplicationError from "../../../utils/error handle/applicationError.js";
import UserRepository from "./user.repository.js";
import ApiResponse from "../../../utils/apiResponse.js";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }
    // This method is used to sign Up
    async signUp(req, res, next) {
        try {
            const user = await this.userRepository.signUp(req.body);
            res.status(201).json(new ApiResponse(201, user, "Registration Successful"));
        } catch (err) {
            next(new ApplicationError(err.message, 400));
        }
    }

    async signIn(req, res, next) {
        const { email, password } = req.body;
        try {
            const result = await this.userRepository.signIn(email, password);
            if (result.success) {
                // Attach jwt token to cookie
                res.cookie('jwt', result.token, {
                    maxAge: 60 * 60 * 24 * 1000
                });
                return res.status(200).json(new ApiResponse(200, { token: result.token }, result.message));
            }

        } catch (err) {
            next(err);
        }
    }


    async forgotPassword(req, res, next){
        const {email} = req.body;
        try{
            const result = await this.userRepository.forgotPassword(email, req);
            if(!result){
                throw new ApplicationError("Something went wrong", 500);
            }
            return res.status(200).json(new ApiResponse(200, {}, "Password reset link sent to your email"))

        }catch(err){
            next(err)
        }

    }

    async resetPassword(req, res, next){
        const {newPassword} = req.body;
        const {token} = req.params;
        try{

            const result = await this.userRepository.resetPassword(newPassword, token);
            if(!result){
                throw new ApplicationError("Something went wrong", 500);
            }
            res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
        }catch(err){
            next(err);
        }
    }

    async logout(req, res, next) {
        try{
            const result = await this.userRepository.logout(req.userId, req.cookies?.jwt);
            if(result.success){
                res.clearCookie("jwt");
                return res.status(200).json(new ApiResponse(200, "", result.message))
            }
            return res.status(400).json(new ApiResponse(400, "", "Bad Request"));
        }catch(err){
            next(err);
        }

    }

    async logoutAllDevices(req, res, next) {
        try {
            const result = await this.userRepository.logoutAllDevices(req?.userId);
            if(result.success){
                res.clearCookie('jwt');
                return res.status(200).json(new ApiResponse(200, "", "Successfully logout from all devices"));
            }
            return res.status(400).json(new ApiResponse(400, "Bad Request", "Bad Request"));

        } catch (err) {
            next(err);
        }
    }
}