import LikesRepository from "./like.repository.js";


export default class LikesController{

    constructor(){
        this.likesRepository = new LikesRepository();
    }

    async toggleLike(req, res, next){
        const userId = req.userId;
        const typeId = req.params.typeId;
        const type = req.query.type;
        if(type != 'Post' && type !='Comment'){
            return res.status(400).send('Invalid request');
        }
        try{
            const like = await this.likesRepository.toggleLike(userId, type, typeId);
            res.    status(200).send(like.message);
        }catch(err){
            console.log(err);
            next(err);
        }   
    }

    async getLikes(req, res, next){
        const {typeId} = req.params;
        const type = req.query.type;
        if(type != 'Post' && type !='Comment'){
            return res.status(400).send('Invalid request');
        }
        try{
            const likes = await this.likesRepository.getLikes(typeId, type);
            res.status(200).send({Likes: likes.length});
        }catch(err){
            console.log(err);
            next(err);
        }
    }
}