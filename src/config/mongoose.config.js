import mongoose from "mongoose";

const url = process.env.URL;

export async function connectToDB(){
    try{
        await mongoose.connect(url);
        console.log("MongoDB connected via mongoose");
    }catch(err){
        throw new Error("Something went wrong in database connection");
    }
    
}