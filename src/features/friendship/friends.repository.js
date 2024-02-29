import ApplicationError from "../../error handle/applicationError.js";
import { FriendModel } from "./friends.schema.js";
import { UserModel } from "../users/authentication/user.repository.js";


export default class FriendsRepository {

    async getFriends(userId) {
        try {
            const friends = await FriendModel.find({ receipient: new mongoose.Types.ObjectId(userId), status: 3 }).populate('receipient', 'name email');
            if (friends.length <= 0) {
                return {
                    success: false,
                    message: "No friends found"
                }
            }
            return {
                success: true,
                friends: friends
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);

        }
    }

    async getPendingRequests(userId) {
        try {
            const pendingFrinedsReq = await FriendModel.find({ receipient: new mongoose.Types.ObjectId(userId), status: 2 }).populate('requester', 'name email').populate("receipient", 'name email');
            if (pendingFrinedsReq.length <= 0) {
                return {
                    success: false,
                    message: "No pending friend request found"
                }
            }
            return {
                success: true,
                friends: pendingFrinedsReq
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

    async toggleFriendship(userId, friendId) {
        try {
            const existingFriendship = await FriendModel.find({
                $or: [
                    { requester: new mongoose.Types.ObjectId(userId), receipient: new mongoose.Types.ObjectId(friendId) },
                    { requester: new mongoose.Types.ObjectId(friendId), receipient: new mongoose.Types.ObjectId(userId) }
                ]
            })
            const requester = await UserModel.findById(userId);
            const receipient = await UserModel.findById(friendId);

            if (existingFriendship.length > 0) {

                if ([1, 2, 3].includes(existingFriendship[0].status) || [1, 2, 3].includes(existingFriendship[1].status)) {
                    requester.friends.pull(existingFriendship[0]._id);
                    receipient.friends.pull(existingFriendship[1]._id);
                    const deleted = await FriendModel.deleteMany({
                        $or: [
                            { requester: new mongoose.Types.ObjectId(userId), receipient: new mongoose.Types.ObjectId(friendId) },
                            { requester: new mongoose.Types.ObjectId(friendId), receipient: new mongoose.Types.ObjectId(userId) }
                        ]
                    })
                    await requester.save();
                    await receipient.save();
                    if (deleted.deletedCount > 0) {
                        return {
                            success: true,
                            message: 'Friend request cancelled'
                        };
                    }

                }

            } else {

                const newFriendRequest = new FriendModel({
                    requester: userId,
                    receipient: friendId,
                    status: 1
                })

                await newFriendRequest.save();
                const pendingFriendRequest = new FriendModel({
                    requester: friendId,
                    receipient: userId,
                    status: 2
                })
                await pendingFriendRequest.save();
                requester.friends.push(newFriendRequest._id);
                receipient.friends.push(pendingFriendRequest._id);
                await requester.save();
                await receipient.save();
                return {
                    success: true,
                    message: 'Friend request sent successfully'
                }
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

    async responseToRequest(userId, friendId, response) {
        try {
            let friendship = await FriendModel.find({
                $or: [
                    { requester: new mongoose.Types.ObjectId(userId), receipient: new mongoose.Types.ObjectId(friendId) },
                    { requester: new mongoose.Types.ObjectId(friendId), receipient: new mongoose.Types.ObjectId(userId) }
                ]
            });

            const requester = await UserModel.findById(userId);
            const receipient = await UserModel.findById(friendId);
            

            if(friendship.length>0){
                if(response=='accepted'){
                    friendship[0].status = 3;
                    friendship[1].status = 3;
                    await friendship[0].save();
                    await friendship[1].save();
                }else if(response=='rejected'){

                    requester.friends.pull(friendship[0]._id);
                    receipient.friends.pull(friendship[1]._id);
                    
                    await FriendModel.deleteMany({
                        $or: [
                            { requester: new mongoose.Types.ObjectId(userId), receipient: new mongoose.Types.ObjectId(friendId) },
                            { requester: new mongoose.Types.ObjectId(friendId), receipient: new mongoose.Types.ObjectId(userId) }
                        ]
                    })
                    await requester.save();
                    await receipient.save();
                }
                
                return { success: true,
                    message: `Friend request ${response}.` };
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }

    }



}