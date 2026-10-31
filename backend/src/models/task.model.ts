import mongoose from "mongoose";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/task.types.js";
import { required } from "zod/mini";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: 1,
            maxlength: 150,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },
        status: {
            type: String,
            enum: [...TASK_STATUSES],
            default: "Todo",
            required: true
        },
        priority: {
            type: String,
            enum: [...TASK_PRIORITIES],
            default: "Medium",
            required: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
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

taskSchema.index({ project: 1,  createdAt: -1 });
taskSchema.index({ workspace: 1, status: 1 });
taskSchema.index({ owner: 1, createdAt: -1});

const Task = mongoose.model("Task", taskSchema);

export default  Task;