import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';

export const auth = async (req, res, next)=>{
    //verifying if token is received
    if(!req.cookies.jwt){
        return res.status(400).send(new ApiResponse(400, "Unauthorized", "Unauthorized Access"));
    }
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
}