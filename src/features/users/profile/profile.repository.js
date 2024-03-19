import mongoose from "mongoose";
import ApplicationError from "../../../utils/error handle/applicationError.js";
import { UserModel } from "../authentication/user.schema.js";
import { ProfileModel } from "./profile.schema.js";

export default class ProfileRepository {

    async getUserProfile(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApplicationError("User does not exists", 404);
        }

        let profile = await ProfileModel.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "owner",
                    foreignField: "_id",
                    as: "account",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                gender: 1,
                                role: 1
                            }
                        }
                    ]
                },
            }

        ])

        if (!profile) {
            throw new ApplicationError("User Profile does not exist", 404);
        }
        return profile[0];
    }

    async updateCoverImageRepo(userId, fileLocalPath, fileStaticUrl) {

        await ProfileModel.findOneAndUpdate(
            { owner: new mongoose.Types.ObjectId(userId) },
            {
                $set: {
                    coverImage: {
                        url: fileStaticUrl,
                        localPath: fileLocalPath
                    }
                }
            },
            { new: true }
        );

        const profile = await this.getUserProfile(userId);
        return profile;
    }

    async updateOrCreateProfileRepo(userId, data) {
        const { firstName, lastName, dob, bio, location, phoneNumber } = data;

        let profile = await ProfileModel.findOneAndUpdate(
            {
                owner: new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    firstName,
                    lastName,
                    bio,
                    dob: new Date(dob),
                    location,
                    phoneNumber
                }
            },
            { new: true }

        );

        profile = await this.getUserProfile(userId);
        return profile;

    }

}

