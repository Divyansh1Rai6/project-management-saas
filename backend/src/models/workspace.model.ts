import mongoose from "mongoose";
import { minLength } from "zod";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

workspaceSchema.index({ owner: 1, createdAt: -1 });

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;