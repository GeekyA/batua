import mongoose from "mongoose";

const connectMongoDb = () => {
    try{
        mongoose.connect(process.env.MONGO_URI || "")
    }catch(err){
        throw err
    }
}

export default connectMongoDb;