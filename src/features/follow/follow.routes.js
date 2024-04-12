import express from 'express';
import { FollowController } from './follow.controller.js';

export const followRouter = express.Router();
const followController = new FollowController();

followRouter.post("/:toBeFollowedId", (req, res, next)=>{
    followController.followUnfollow(req, res, next)
});
followRouter.get("/followers/:user", (req, res, next)=>{
    followController.followerList(req, res, next)
});
followRouter.get("/following/:user", (req, res, next)=>{
    followController.followingList(req, res, next)
});


