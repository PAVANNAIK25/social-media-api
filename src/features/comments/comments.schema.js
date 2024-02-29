import mongoose from "mongoose"

export const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]

})