import bcrypt from 'bcrypt';

export const hashedPass = async (password)=>{
    return await bcrypt.hash(password, 12);
} 

export const verifyPass = async(password, hashedPass) =>{
    return await bcrypt.compare(password, hashedPass);
}