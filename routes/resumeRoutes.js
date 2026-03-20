import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/analyzer.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("resume"), analyzeResume);

export default router;