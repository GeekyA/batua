import exp from "constants";
import mongoose from "mongoose";

const connectMongoDb = () => {
    try{
        mongoose.connect(process.env.MONGO_URI || "")
    }catch(err){
        throw new Error("Error connecting to MongoDB")
    }
}

export default connectMongoDb;