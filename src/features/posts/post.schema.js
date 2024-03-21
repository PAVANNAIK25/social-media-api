import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        index: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    images: {
        type: [
            {
                url: String,
                localPath: String,
            },
        ],
        default: [],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
}, { timeStamp: true });

export const PostModel = mongoose.model('Post', postSchema);
