import ApplicationError from "../../utils/error handle/applicationError.js";
import { UserModel } from "../users/authentication/user.schema.js";
import { followModel } from "./follow.schema.js";
import mongoose from 'mongoose';

export default class FollowRepository {

    async followUnfollowRepo(userId, toBeFollowedId) {

        const toBeFollowed = await UserModel.findById(toBeFollowedId);

        if (!toBeFollowed) {
            throw new ApplicationError("User does not exist", 404);
        }

        if (userId.toString() === toBeFollowedId.toString()) {
            throw new ApplicationError("Cannot follow yourself", 400);
        }

        const isAlreadyFollowed = await followModel.findOne({
            followerId: new mongoose.Types.ObjectId(userId),
            followeeId: new mongoose.Types.ObjectId(toBeFollowedId)
        })

        if (isAlreadyFollowed) {
            const unfollow = await followModel.findOneAndDelete({
                followerId: new mongoose.Types.ObjectId(userId),
                followeeId: new mongoose.Types.ObjectId(toBeFollowedId)
            });

            return {
                type: "unfollow",
                message: "Unfollowed successfully"
            };

        } else {


            const follow = await followModel.create({
                followerId: new mongoose.Types.ObjectId(userId),
                followeeId: new mongoose.Types.ObjectId(toBeFollowedId)
            })
            return {
                type: "follow",
                message: "Followed successfully"
            };
        }
    }

    async followersList(page, userId) {
        let perPage = 5;

        const userAggregation = await UserModel.aggregate([
            {
                $lookup: {
                    from: "profiles",
                    localField: "_id",
                    foreignField: "owner",
                    as: "User",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                    lastName: 1,
                    dob: 1,
                    coverImage: 1,
                    bio: 1,
                    location: 1,
                    phoneNumber: 1
                            },

                        },

                    ],
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    dob: 1,
                    coverImage: 1,
                    bio: 1,
                    location: 1,
                    phoneNumber: 1

                }
            }

        ]);
        const user = userAggregation[0];

        if (!user) {
            throw new ApplicationError("User does not exist", 404);
        }

        const followerAggregation = await followModel.aggregate([
            {
                $match: { followeeId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "followerId",
                    foreignField: "owner",
                    as: "followers",
                    pipeline: [{
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: "account",
                            pipeline: [{
                                $project: {
                                    name: 1,
                                    email: 1,
                                    gender: 1,
                                    role: 1
                                },
                            }]
                        }
                    }
                    ]
                }
            }


        ]);

        return {
            user,
            followerAggregation
        };

    }


}