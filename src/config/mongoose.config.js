
import mongoose from "mongoose";

const url = process.env.URL;

let client;

export async function connectToDB(){
    try{

        client = await mongoose.connect(url);
        console.log("MongoDB connected via mongoose");
    }catch(err){
        console.log(err);
        throw new Error("Something went wrong in database connection");
    }
    
}