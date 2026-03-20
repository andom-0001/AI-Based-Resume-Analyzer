import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse").default || require("pdf-parse");

export const parseResume = async (filePath, mimetype) => {
  if (mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (mimetype.includes("word")) {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  }

  throw new Error("Unsupported file format");
};