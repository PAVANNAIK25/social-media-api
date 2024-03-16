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
            res.status(201).send(ApiResponse(201, user, "Registration Successful"));
        } catch (err) {
            next(new ApplicationError(err.message, 400));
        }
    }

    async signIn(req, res, next) {
        const { email, password } = req.body;
        try {
            const result = await this.userRepository.signIn(email, password);
            if (result.success) {
                // attaching jwt token to cookie
                res.cookie('jwt', result.token, {
                    maxAge: 60 * 60 * 24 * 1000
                });
                return res.status(200).json({
                    success: result.success,
                    message: result.message,
                    token: result.token
                });
            }
            
            res.status(400).send("Invalid credentials");

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async logout(req, res, next) {

        res.clearCookie("jwt");
        return res.status(200).send("Logout successfully");

    }

    async logoutAllDevices(req, res, next) {
        const userId = req.userId;
        try {
            await this.userRepository.logoutAllDevices(userId);
            res.clearCookie('jwt');
            res.status(200).send("Successfully logout from all devices");

        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}