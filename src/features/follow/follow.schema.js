import mongoose from "mongoose";


const followSchema = new mongoose.Schema({
    followerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    followeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});


export const followModel = mongoose.model('Follow', followSchema);