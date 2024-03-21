import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { PostModel } from "../posts/post.schema.js";
import ApplicationError from "../../utils/error handle/applicationError.js";


const LikeModel = mongoose.model('Like', likeSchema);

export default class LikesRepository{

    async toggleLike(userId, type, typeId){

        try{            
            if(type == 'Post'){
                const post = await PostModel.findById(typeId);
                const like = await LikeModel.findOne({user: userId, likeable: typeId});
                if(!like){
                    const newLike = new LikeModel({
                        likeable: typeId,
                        model: type,
                        user: userId
                    })
                    
                    await newLike.save();
                    post.likes.push(newLike._id);
                    await post.save();
                    return {message: "Liked successfully!"}
                }else{
                    await LikeModel.deleteOne({_id: like._id});
                    return {message: "unliked successfully!"}
                }
                
            }else if(type == 'Comment'){
                const comment =  findById(typeId);
                const like = LikeModel.findOne({user: userId, likeable: typeId});
                if(!like){
                    const newLike = new LikeModel({
                        likeable: typeId,
                        model: type,
                        user: userId
                    })
                    await newLike.save();
                    comment.likes.push(newLike._id);
                    await post.save();
                    return {message: "Liked successfully!"}
                }else{
                    await LikeModel.deleteOne({_id: like._id});
                    return {message: "unliked successfully!"}
                }

            }
            
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with database', 500);
        }
            
    }    

    async getLikes(typeId, type){
        try{

            const likes = await LikeModel.find({
                likeable: new mongoose.Types.ObjectId(typeId),
                model: type
            });

            return likes;
            
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with database', 500);   
        }
    }

}