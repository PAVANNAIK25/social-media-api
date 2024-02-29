import express from 'express';
import UserController from './users.controller.js';
import {auth} from '../../../middlewares/jwt.middleware.js'
import ProfileController from '../profile/profile.controller.js';

const userRouter = express.Router();

const userController = new UserController();
const profileController = new ProfileController();

userRouter.post("/signup", (req, res, next)=>{
    userController.signUp(req, res, next);
})

userRouter.post("/signin", (req, res, next)=>{
    userController.signIn(req, res, next);
})

userRouter.get("/logout", auth, (req, res, next)=>{
    userController.logout(req, res, next);
})

userRouter.get("/logout-all-devices", auth, (req, res, next)=>{
    userController.logoutAllDevices(req, res, next);
})


// userProfile Routes

userRouter.get("/get-details/:userId", auth, (req, res, next)=>{
    profileController.getUserProfile(req, res, next);
})

userRouter.get("/get-all-details", auth, (req, res, next)=>{
    profileController.getAllUsers(req, res, next);
})

userRouter.put("/update-details/:userId", auth, (req, res, next)=>{
    profileController.updateDetails(req, res, next);
})

export default userRouter;