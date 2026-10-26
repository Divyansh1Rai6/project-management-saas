import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import type { RegisterInput } from "../validation/auth.validator.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import revokedToken from "../models/revoked-token.model.js";
import RefreshToken from "../models/refresh-token.model.js";


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
        ) {
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

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new ApiError(500, "Authentication configuration error");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },
        secret,
        { expiresIn: "15m" }
    );

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
        user: user._id,
        tokenHash: refreshTokenHash,
        expiresAt,
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
        refreshToken,
    };
};

export const logoutUser = async (token: string, refreshToken: string) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new ApiError(500, "Authentication configuration error");
    }

    let expiry: number;

    try {
        const verified = jwt.verify(token, secret);

        if (
            typeof verified === "string" ||
            typeof verified.exp !== "number"
        ) {
            throw new Error("Invalid token payload");
        }

        expiry = verified.exp;
    } catch {
        throw new ApiError(401, "Invalid or expired authentication token");
    }

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const storedRefreshToken = await RefreshToken.findOne({
        tokenHash: refreshTokenHash,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
    });

    let userId: string;

    try {
        const decoded = jwt.verify(token, secret);
        if(
            typeof decoded === "string" || typeof decoded.userId !== "string"
        ) {
            throw new Error("Inavlid token payload");
        }

        userId = decoded.userId;

    } catch {
        throw new ApiError(401, "Invalid authentication token");
    }  

    if(
        !storedRefreshToken || storedRefreshToken.user.toString() !== userId
    ) {
        throw new ApiError(401, "Invalid refresh token")
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await revokedToken.updateOne(
        { tokenHash },
        {
            $setOnInsert: {
                tokenHash,
                expiresAt: new Date(expiry * 1000),
            },
        },
        { upsert: true }
    );

    const result = await RefreshToken.updateOne(
        {
            _id: storedRefreshToken._id,
            revokedAt: null,
        },
        {
            $set: { revokedAt: new Date() },
        }
    );

    if(result.modifiedCount !== 1) {
        throw new ApiError(401, "Refresh token has already been used");
    }

    return { message: "Logged out successfully" };
};


const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

const hashRefreshToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const refreshAccessToken = async (refreshToken: string) => {
    const tokenHash = hashRefreshToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        tokenHash,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
        throw new ApiError(401, "User no longer exists");
    }

    const consumedToken = await RefreshToken.findOneAndUpdate(
        {
            _id: storedToken._id,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        },
        {
            $set: { revokedAt: new Date() },
        },
        { new: true }
    );

    if (!consumedToken) {
        throw new ApiError(401, "Refresh token has already been used");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new ApiError(500, "Authentication configuration error");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },
        secret,
        { expiresIn: "15m" }
    );

    const newRefreshToken = generateRefreshToken();

    await RefreshToken.create({
        user: user._id,
        tokenHash: hashRefreshToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        token,
        refreshToken: newRefreshToken,
    };
};
