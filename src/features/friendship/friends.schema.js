import mongoose from "mongoose";

const friendSchema = mongoose.Schema({
    requester:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type: Number,
        enum:[
            0, //'add friend'
            1, //'requested'
            2, //'pending'
            3 //'friends'
        ]
    },

});

export const FriendModel = mongoose.model('Friend', friendSchema);
