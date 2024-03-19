import express from 'express';
import ProfileController from './profile.controller.js';
import {auth} from '../../../middlewares/jwt.middleware.js'
import { upload } from '../../../middlewares/file-upload.middleware.js';

const profileRouter = express.Router();

const profileController = new ProfileController();

// userProfile Routes



profileRouter.patch("/", auth, (req, res, next)=>{
    profileController.updateOrCreateProfile(req, res, next);
}).get("/", auth, (req, res, next)=>{
    profileController.getUserProfile(req, res, next);
})

profileRouter.get("/:userId", auth, (req, res, next)=>{
    profileController.getUserProfile(req, res, next);
})

profileRouter.patch("/cover-image", auth, upload.single("coverImage"), (req, res, next)=>{
    profileController.updateCoverImage(req, res, next);
})



export default profileRouter;



