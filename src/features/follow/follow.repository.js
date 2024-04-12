import ApplicationError from "../../utils/error handle/applicationError.js";
import { ProfileModel } from "../users/profile/profile.schema.js";
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
        let perPage = 10;
        const userAggregation = await ProfileModel.aggregate([
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

        ]);
        const user = userAggregation[0];

        if (!user) {
            throw new ApplicationError("User does not exist", 404);
        }

        const followers = await followModel.aggregate([
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
                    as: "follower",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "account",
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            email: 1,
                                            gender: 1,
                                            role: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                account: {
                                    $first: "$account"
                                }
                            }
                        }
                    ],
                },
            },
            {
                $addFields: {
                    profile: {
                        $first: "$follower"
                    }
                }
            },
            {
                $project: {
                    profile: 1
                }
            }
        ]);
        const followersCount = await followModel.countDocuments({ followeeId: new mongoose.Types.ObjectId(userId) });
        return {
            user,
            followers,
            followersCount
        };

    }

    async followingList(page, userId) {
        let perPage = 10;

        const userAggregation = await ProfileModel.aggregate([
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

        ]);
        const user = userAggregation[0];

        if (!user) {
            throw new ApplicationError("User does not exist", 404);
        }

        const following = await followModel.aggregate([
            {
                $match: { followerId: new mongoose.Types.ObjectId(userId) }
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
                    localField: "followeeId",
                    foreignField: "owner",
                    as: "followee",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "account",
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            email: 1,
                                            gender: 1,
                                            role: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                account: {
                                    $first: "$account",
                                },
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    profile: {
                        $first: "$followee"
                    },
                },
            },
            {
                $project: {
                    profile: 1,
                    _id:0
                },
            }
        ]);

        const followingCount = await followModel.countDocuments({ followerId: new mongoose.Types.ObjectId(userId) });
        return {
            user,
            following,
            followingCount
        };

    }


}