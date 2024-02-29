import ApplicationError from "../../../error handle/applicationError.js";
import { UserModel } from "../authentication/user.repository.js";

export default class ProfileRepository {

    async getUserProfile(userId) {
        try {
            const user = await UserModel.findById(userId).select('name email gender');
            return user;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.find().select("name email gender");
            return users;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

    async updateDetails(userId, name, email, gender) {
        try {
            const user = await UserModel.findById(userId).select({name:1, email:1, gender:1});

            if(name){
                user.name= name;
            }

            if(email){
                user.email = email;
            }

            if(gender){
                user.gender = gender;
            }

            await user.save();
            
            return user;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

}

