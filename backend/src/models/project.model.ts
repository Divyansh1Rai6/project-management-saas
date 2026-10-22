import mongoose from "mongoose";
import { PROJECT_STATUSES } from "../types/project.types.js";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            required: true,
            enum: [...PROJECT_STATUSES],
            default: "Planning",
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema)

export default Project;