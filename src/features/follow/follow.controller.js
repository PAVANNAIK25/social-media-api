import ApiResponse from "../../utils/apiResponse.js";
import FollowRepository from "./follow.repository.js";


export class FollowController {

    constructor(){
        this.followRepo = new FollowRepository();
    }

    async followUnfollow(req, res, next){
        const toBeFollowedId = req.params.toBeFollowedId;
        const userId = req.userId; 
        try { 
            const result = await this.followRepo.followUnfollowRepo(userId, toBeFollowedId);

            res.status(200).json(new ApiResponse(200, {}, result.message));

        } catch (error) {
            next(error);
        } 

    }

    async followerList(req, res, next){
        const {user} = req.params;
        let page = req.query?.page;
        if(!page){
            page =1;
        }
        try {
            const result = await this.followRepo.followersList(page, user);
            res.status(200).json(new ApiResponse(200, result, "Followers retrived successfully"));

        } catch (error) {
            next(error);
        }
    }
}