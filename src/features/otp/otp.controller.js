import OtpRepository from "./otp.repository.js";
import bcrypt from 'bcrypt';

export default class OtpController {
    constructor() {
        this.otpRepository = new OtpRepository();
    }

    async sendOtp(req, res, next) {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send("Please send valid email");
        }

        const result = await this.otpRepository.sendOtp(email);

        res.status(200).send(result.message);

    }

    async verifyOtp(req, res, next) {
        const email = req.body.email;
        const otp = req.body.otp;
        try {

            if (!email) {
                return res.status(400).send("Please send valid email");
            }

            const result = await this.otpRepository.verifyOtp(email, otp);
            if (!result.success) {
                return res.status(400).send(result.message);
            }

            res.status(200).send(result.message);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        const { email, password } = req.body;
        try {

            const hashedPassword = await bcrypt.hash(password, 12);
            const result = await this.otpRepository.resetPassword(email, hashedPassword);
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