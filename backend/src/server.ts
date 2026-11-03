import express from "express";
import connectDB from "./config/database.js";
import projectRoutes from "./routes/project.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";


const app = express();



const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Project management Saas Backend is running",
    })
})

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/workspaces", workspaceRoutes);

app.use("/api/projects", projectRoutes);


app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on the port ${PORT}`);
        });
    }   catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();