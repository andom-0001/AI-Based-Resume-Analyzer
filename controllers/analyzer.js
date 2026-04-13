import fs from "fs";
import Resume from "../models/Resume.js";
import { parseResume } from "../utils/parser.js";
import { analyzeResumeLocal } from "../utils/localAI.js";
import { generateResumeHTML } from "../utils/generator.js";

export const analyzeResume = async (req, res) => {
  try {
    const text = await parseResume(req.file.path, req.file.mimetype);
    const result = analyzeResumeLocal(text);

    fs.unlinkSync(req.file.path);

    res.json({ data: { analysis: result } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateResumeHandler = (req, res) => {
  const { template, ...data } = req.body;

  const html = generateResumeHTML(data, template);
  const analysis = analyzeResumeLocal(html);

  res.json({ resume: html, analysis });
};