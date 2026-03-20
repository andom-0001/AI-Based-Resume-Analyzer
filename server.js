import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Resume Analyzer Running");
});

app.use("/api/resume", resumeRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});