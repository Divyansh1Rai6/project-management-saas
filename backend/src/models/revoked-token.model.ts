import mongoose from "mongoose";
import { string } from "zod";

const revokedTokenSchema = new mongoose.Schema(
    {
        tokenHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            expires: 0,
        },
    },
    { timestamps: true }
)
const revokedToken = mongoose.model(
    "RevokedToken",
    revokedTokenSchema
);

export default revokedToken;