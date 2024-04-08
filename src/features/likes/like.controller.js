import ApiResponse from "../../utils/apiResponse.js";
import ApplicationError from "../../utils/error handle/applicationError.js";
import { converToTitleCase } from "../../utils/helpers.js";
import LikesRepository from "./like.repository.js";


export default class LikesController {

    constructor() {
        this.likesRepository = new LikesRepository();
    }

    // this controller will handle like or unlike of posts and comments

    async toggleLike(req, res, next) {
        const userId = req.userId;
        const typeId = req.params.typeId;
        const type = converToTitleCase(req.query?.type);
        
        try {
            if (type != 'Post' && type != 'Comment') {
                throw new ApplicationError('Invalid request', 400);
            }
            const like = await this.likesRepository.toggleLike(userId, type, typeId);
            res.status(200).send(new ApiResponse(200, like, `${type} ${like.isLiked ? "liked" : "unliked"} sucessfully!`));
        } catch (err) {
            next(err);
        }
    }

    // this method will retrive all likes of post or comment
    async getLikes(req, res, next) {
        const { typeId } = req.params;
        const type = converToTitleCase(req.query?.type);
        let page = req.query?.page;
        if (!page) {
            page = 1;
        }
        try {
            if (type != 'Post' && type != 'Comment') {
                throw new ApplicationError('Invalid request', 400);
            }
            const result = await this.likesRepository.getLikes(typeId, type, page);
            if(result.likes.length <=0){
                throw new ApplicationError('Invalid request', 400);
            }
            res.status(200).send(new ApiResponse(200,
                {
                    page: `${page} / ${parseInt((result.totalLikes / 5) + 1)}`,
                    likesCount: result.totalLikes,
                    likes: result.likes
                }, 
                `Retrived likes on a ${type}`));
        } catch (err) {
            next(err);
        }
    }
}