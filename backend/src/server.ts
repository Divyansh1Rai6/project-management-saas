import express from "express";
import connectDB from "./config/database.js";
import projectRoutes from "./routes/project.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();



const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Project management Saas Backend is running",
    })
})

app.use("/api/projects", projectRoutes)

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on the PORT ${PORT}`);
});