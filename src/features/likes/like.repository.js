import mongoose from "mongoose";
import { LikeModel } from "./like.schema.js";
import { PostModel } from "../posts/post.schema.js";
import { CommentModel } from "../comments/comments.schema.js";
import ApplicationError from "../../utils/error handle/applicationError.js";

export default class LikesRepository {
    // this method will handle like or unlike of posts and comments
    async toggleLike(userId, type, typeId) {
        let model;
        if (type == 'Post') {
            model = PostModel;
        } else if (type == 'Comment') {
            model = CommentModel;
        }
        const typeOfModel = await model.findById(typeId);
        if(!typeOfModel){
            throw new ApplicationError(`${type} not found`);
        }

        const like = await LikeModel.findOne({ user: userId, likeable: typeId });
        if (!like) {
            const newLike = new LikeModel({
                likeable: typeId,
                model: type,
                user: userId
            })
            await newLike.save();
            typeOfModel.likes.push(newLike._id);
            await typeOfModel.save();
            return { "isLiked": true }
        } else {
            await model.updateOne({ likes: like._id }, { $pull: { likes: like._id } })
            await LikeModel.deleteOne({ _id: like._id });
            return { "isLiked": false }
        }
    }

    // this method will retrive likes on specific post or comments
    async getLikes(typeId, type, page) {
        let perPage = 5;
        const likes = await LikeModel.aggregate([
            {
                $match: {
                    likeable: new mongoose.Types.ObjectId(typeId),
                    model: type
                }
            },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    user: 1,
                    createdAt: 1
                }
            }

        ])
        if(!likes){
            throw new ApplicationError("No likes found", 404);
        }

        const totalLikes = await LikeModel.countDocuments({
            likeable: new mongoose.Types.ObjectId(typeId),
            model: type
        })

        return {likes, totalLikes};
    }

}