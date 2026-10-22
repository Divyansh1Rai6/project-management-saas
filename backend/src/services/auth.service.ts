import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import type { RegisterInput } from "../validation/auth.validator.js";
import jwt from "jsonwebtoken";
export const registerUser = async (data: RegisterInput) => {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new ApiError(409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    try {
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        return user;
    }
    
    catch (error: unknown) {
    if (
        typeof error === "object" && 
        error !== null && 
        "code" in error &&
        error.code === 11000
    )   {
        throw new ApiError(409, "Email is already registered");
    }
    throw error;
}

}   

interface LoginInput {
    email: string,
    password: string;   
}

export const loginUser = async (data: LoginInput) => {
    const email = data.email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) 
        throw new ApiError(401, "Invalid email or password");

    const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
    );
    
    if (!isPasswordCorrect) 
        throw new ApiError(401, "Invalid email or password");

    const secret = process.env.JWT_SECRET;

    if (!secret)
        throw new ApiError(500, "Authentication configuration error");

    const token = jwt.sign(
        { userId: user._id.toString() },
        secret,
        { expiresIn: "15m" }
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};