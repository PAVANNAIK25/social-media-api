import ProfileRepository from "./profile.repository.js";

export default class ProfileController{
    constructor(){
        this.profileRepository = new ProfileRepository();
    }

    async getUserProfile(req, res, next){
        const userId = req.params.userId;
        try{
            const user = await this.profileRepository.getUserProfile(userId);
            res.status(200).send(user);
        }catch(err){
            console.log(err);
            next(err);
        }

    }

    async getAllUsers(req, res, next){
        try{
            const users = await this.profileRepository.getAllUsers();
            res.status(200).send(users);
        }catch(err){
            console.log(err);
            next(err);
        }

    }

    async updateDetails(req, res, next){
        const userId = req.params.userId;
        const {name, email, gender} = req.body;
        try{
            const user = await this.profileRepository.updateDetails(userId, name, email, gender);
            res.status(200).send(user);
        }catch(err){
            console.log(err);
            next(err);
        }

    }

    
}

