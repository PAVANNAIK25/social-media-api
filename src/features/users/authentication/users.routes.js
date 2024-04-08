import express from 'express';
import UserController from './users.controller.js';
import {auth} from '../../../middlewares/jwt.middleware.js'

// User Router
const userRouter = express.Router();

//Controller Instance
const userController = new UserController();

userRouter.post("/signup", (req, res, next)=>{
    userController.signUp(req, res, next);
})

userRouter.post("/signin", (req, res, next)=>{
    userController.signIn(req, res, next);
})

userRouter.post("/forgot-password", (req, res, next)=>{
    userController.forgotPassword(req, res, next);
})

userRouter.post("/reset-password/:token", (req, res, next)=>{
    userController.resetPassword(req, res, next);
})

//secure routes

userRouter.get("/logout", auth, (req, res, next)=>{
    userController.logout(req, res, next);
})

userRouter.get("/logout-all-devices", auth, (req, res, next)=>{
    userController.logoutAllDevices(req, res, next);
})

export default userRouter;