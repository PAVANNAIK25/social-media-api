import FriendsRepository from "./friends.repository.js";

export default class FriendsController {
    constructor() {
        this.friendRepository = new FriendsRepository();
    }

    async getFriends(req, res, next) {
        try {
            const userId = req.params.userId;
            const result = await this.friendRepository.getFriends(userId);
            if (!result.success) {
                return res.status(400).send(result.message);
            }

            res.status(200).send(result.friends);

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async getPendingRequests(req, res, next) {
        const userId = req.userId;
        try {
            const result = await this.friendRepository.getPendingRequests(userId);
            if (!result.success) {
                return res.status(400).send(result.message);
            }

            res.status(200).send(result.friends);

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async toggleFriendship(req, res, next){
        const userId = req.userId;
        const friendId = req.params.friendId;
        try{
            const result = await this.friendRepository.toggleFriendship(userId, friendId);
            if (!result.success) {
                return res.status(400).send(result.message);
            }

            res.status(200).send(result.message);

        }catch (err) {
            console.log(err);
            next(err);
        }
    }

    async responseToRequest(req, res, next){
        const userId = req.userId;
        const friendId = req.params.friendId;
        const response = req.query.response;
        try{

            const result = await this.friendRepository.responseToRequest(userId, friendId, response);
            if(!result.success){
                return res.status(400).send(result.message);
            }
            return res.status(200).send(result.message);

        }catch(err){
            console.log(err);
            next(err);
        }
    }



}