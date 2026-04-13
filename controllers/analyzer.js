import fs from "fs";
import Resume from "../models/Resume.js";
import { parseResume } from "../utils/parser.js";
import { analyzeResumeLocal } from "../utils/localAI.js";
import { generateResumeHTML } from "../utils/generator.js";

// 🔹 Upload Resume
export const analyzeResume = async (req, res) => {
  const text = await parseResume(req.file.path, req.file.mimetype);
  const result = analyzeResumeLocal(text);

  await Resume.create({
    userId: req.userId,
    analysis: result,
  });

  fs.unlinkSync(req.file.path);

  res.json({ analysis: result });
};

// 🔹 Generate Resume
export const generateResumeHandler = async (req, res) => {
  const { template, theme, ...data } = req.body;

  const html = generateResumeHTML(data, template, theme);
  const analysis = analyzeResumeLocal(html);

  await Resume.create({
    userId: req.userId,
    analysis,
  });

  res.json({ resume: html, analysis });
};

// 🔹 Get user resumes
export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.userId });
  res.json(resumes);
};