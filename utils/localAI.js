import natural from "natural";

const tokenizer = new natural.WordTokenizer();

const skillsList = [
  "javascript", "java", "python", "node", "react",
  "mongodb", "sql", "html", "css", "docker", "aws"
];

export const analyzeResumeLocal = (text) => {
  const words = tokenizer.tokenize(text.toLowerCase());

  const foundSkills = skillsList.filter(skill =>
    words.includes(skill)
  );

  const score = Math.min(100, (foundSkills.length / skillsList.length) * 100);

  const missingSkills = skillsList.filter(skill =>
    !foundSkills.includes(skill)
  );

  const suggestions = [];
  if (foundSkills.length < 5) {
    suggestions.push("Add more technical skills");
  }
  if (!text.toLowerCase().includes("project")) {
    suggestions.push("Add projects section");
  }
  if (!text.toLowerCase().includes("experience")) {
    suggestions.push("Add experience section");
  }

  return {
    atsScore: Math.round(score),
    skills: foundSkills,
    missingSkills,
    suggestions,
  };
};