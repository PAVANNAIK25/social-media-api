import mongoose from "mongoose";

export const likeSchema = mongoose.Schema({
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
})