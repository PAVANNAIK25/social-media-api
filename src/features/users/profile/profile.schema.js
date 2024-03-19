import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
    coverImage: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png",
            localPath: ""
        }
    },
    firstName: {
        type: String,
        default: "John",
    },
    lastName: {
        type: String,
        default: "Doe",
    },
    bio: {
        type: String,
        default: "",
    },
    dob: {
        type: Date,
        default: null,
    },
    location: {
        type: String,
        default: "",
    },
    phoneNumber: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},
{timeStamp: true});

export const ProfileModel = mongoose.model('Profile', profileSchema);