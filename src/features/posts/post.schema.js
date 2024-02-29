import mongoose from "mongoose";


export const postSchema = mongoose.Schema({
    caption:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
})