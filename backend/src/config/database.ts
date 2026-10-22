import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log("MONGODB connected successfully");
    } catch (error)  {
        console.error("MONGODB connection failed:", error);
        process.exit(1);
    } 
}
export default connectDB;