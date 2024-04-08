import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'model'
    },
    model:{
        type: String,
        enum: ['Post', 'Comment']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, {timestamps: true})

export const LikeModel = mongoose.model('Like', likeSchema);