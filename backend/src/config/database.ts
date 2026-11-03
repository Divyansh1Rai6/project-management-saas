import mongoose from "mongoose";
import "dotenv/config"


const connectDB = async (): Promise<void> => {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        await mongoose.connect(mongoURI);

        console.log("MONGODB connected successfully");
    } catch (error)  {
        console.error("MONGODB connection failed:", error);
        throw error;
    } 
};
export default connectDB;