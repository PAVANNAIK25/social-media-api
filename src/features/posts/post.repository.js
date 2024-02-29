import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import ApplicationError from "../../error handle/applicationError.js"


export const PostModel = mongoose.model('Post', postSchema);

export default class PostRepository{

    async createPost(caption, imageUrl, userId){
        try{
            const newPost = new PostModel({caption, imageUrl, user: userId});
            return await newPost.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }

    }

    async updatePost(postId, userId, caption, imageUrl){
        try{
            const post = await PostModel.findOne({_id: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId)});
            if(!post){
                return {
                    success: false,
                    message: "Post not found"
                }
            }

            if(caption){
                post.caption = caption;
            }

            if(imageUrl){
                post.imageUrl = imageUrl;
            }
            return await post.save();

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async deletePost(postId, userId){
        try{
            const deleted = await PostModel.deleteOne({_id: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId)});
            return deleted.deletedCount>0;

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async getAllPost(){
        try{
            const posts = await PostModel.find();
            return posts;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async getPost(postId){
        try{
            const post = await PostModel.findById(postId);
            return post;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async getPostByUser(userId){
        try{
            const posts = await PostModel.find({user:userId});
            return posts;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }
    
}