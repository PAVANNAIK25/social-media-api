import jwt from 'jsonwebtoken';
import { UserModel } from '../features/users/authentication/user.schema.js';

export const auth = async (req, res, next)=>{
    //verifying if token is received
    if(!req.cookies.jwt){
        return res.status(400).send("Unauthorized");
    }
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await UserModel.findOne({_id: decoded.userId});
    if(!user.sessions.includes(token)){
       return res.status(400).send("Unauthorized");
    }
    next();
}