import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./src/routes/taskRoutes";
import teamRoutes from "./src/routes/teamRoutes";
import userRoutes from "./src/routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
