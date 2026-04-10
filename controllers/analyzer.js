import fs from "fs";
import Resume from "../models/Resume.js";
import { parseResume } from "../utils/parser.js";
import { analyzeResumeLocal } from "../utils/localAI.js";
import { generateResumeHTML } from "../utils/generator.js";

// 🔹 Upload Resume (PDF)
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
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Generate Resume
export const generateResumeHandler = (req, res) => {
  try {
    const { template, ...data } = req.body;

    const htmlResume = generateResumeHTML(data, template);

    const analysis = analyzeResumeLocal(htmlResume);

    res.json({
      resume: htmlResume,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};