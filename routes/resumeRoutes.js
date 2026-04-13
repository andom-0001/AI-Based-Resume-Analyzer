import express from "express";
import multer from "multer";
import {
  analyzeResume,
  generateResumeHandler,
  getMyResumes
} from "../controllers/analyzer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", authMiddleware, upload.single("resume"), analyzeResume);
router.post("/generate", authMiddleware, generateResumeHandler);
router.get("/my", authMiddleware, getMyResumes);

export default router;