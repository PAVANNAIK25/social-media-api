import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';


export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        try {
            const password = req.body.password;
            const hashedPassword = await bcrypt.hash(password, 12);
            const userData = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                gender: req.body.gender
            }
            const user = await this.userRepository.signUp(userData);
            res.status(201).send(user);

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async signIn(req, res, next) {
        const { email, password } = req.body;
        try {
            const result = await this.userRepository.signIn(email, password);
            if (result.success) {
                res.cookie('jwt', result.token, {
                    maxAge: 60 * 60 * 24 * 1000
                });
                return res.status(200).send("Login Successful!");
            } else {
                res.status(400).send("Invalid credentials");
            }

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