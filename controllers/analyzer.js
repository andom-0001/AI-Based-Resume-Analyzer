import fs from "fs";
import Resume from "../models/Resume.js";
import { parseResume } from "../utils/parser.js";
import { analyzeResumeLocal } from "../utils/localAI.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await parseResume(req.file.path, req.file.mimetype);

    const result = analyzeResumeLocal(text);

    const saved = await Resume.create({
      analysis: result,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};