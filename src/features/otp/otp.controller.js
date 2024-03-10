import OtpRepository from "./otp.repository.js";

export default class OtpController {
    constructor() {
        this.otpRepository = new OtpRepository();
    }

    async sendOtp(req, res, next) {
        try {
            const email = req.body.email;
            if (!email) {
                return res.status(400).send("Please send valid email");
            }
            const result = await this.otpRepository.sendOtp(email);
            res.status(200).send(result.message);
        } catch (error) {
            next(error);
        }
    }

    async verifyOtp(req, res, next) {
        const {email, otp} = req.body;
        try {
            if (!email) {
                return res.status(400).send("Please send valid email");
            }
            const result = await this.otpRepository.verifyOtp(email, otp);
            if (!result.success) {
                return res.status(400).send(result.message);
            }
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        const {newPassword, confirmPassword} = req.body;
        const token = req.query.token;
        try {
            if(newPassword!=confirmPassword){
                return res.status(400).send({message: "new and confirm password does not match"});
            }
            const result = await this.otpRepository.resetPassword(token, newPassword);
            if (!result.success) {
                return res.status(400).send(result.message);
            }
            res.status(200).send(result.message);
        } catch (err) {
            console.log(err);
            next(err);
        }

    }

}