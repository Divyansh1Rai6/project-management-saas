import express from "express";
import type { Server } from "node:http";
import connectDB, { disconnectDB } from "./config/database.js";
import projectRoutes from "./routes/project.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";


const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get("/",(req, res) => {
    res.status(200).json({
        success: true,
        message: "Project management Saas Backend is running",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        message: "backend is healthy",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware);

let server : Server | undefined;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }   catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

const shutdown = (signal: string): void => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    console.log(`${signal} received. Starting graceful shutdown...`);

    const forceShutdownTimer = setTimeout(() => {
        console.error("Graceful shutdown timed out. Forcing exit");

        server?.closeAllConnections();

        process.exit(1);
    }, 10_000);

    forceShutdownTimer.unref();

    const closeDatabaseAndExit = async (): Promise<void> => {
        try {
            await disconnectDB();

            console.log("Graceful shutdown completed.");

            clearTimeout(forceShutdownTimer);

            process.exit(0);
        }   catch (error) {
            console.error("Database shutdown failed:", error);

            clearTimeout(forceShutdownTimer);

            process.exit(1);
        }
    };

    if (!server) {
        void closeDatabaseAndExit();
        return;
    }

    server.close((error) => {
        if (error) {
            console.error("HTTP server shutdown failed:", error);
            clearTimeout(forceShutdownTimer);
            process.exit(1);
            return;
        }

        console.log("HTTP server closed.");
        void closeDatabaseAndExit();
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
