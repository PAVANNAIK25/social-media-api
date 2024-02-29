import express from 'express';
import FriendsController from './friends.controller.js';

const friendsRouter = express.Router();
const friendsController = new FriendsController();

friendsRouter.get("/get-friends/:userId", (req, res, next)=>{
    friendsController.getFriends(req, res, next);
})

friendsRouter.get("/toggle-friendship/:friendId", (req, res, next)=>{
    friendsController.toggleFriendship(req, res, next);
});

friendsRouter.get("/get-pending-requests", (req, res, next)=>{
    friendsController.getPendingRequests(req, res, next);
})


friendsRouter.get("/response-to-request/:friendId", (req, res, next)=>{
    friendsController.responseToRequest(req, res, next);
})

export default friendsRouter;