import natural from "natural";

const tokenizer = new natural.WordTokenizer();

const skillsList = [
  "javascript","java","python","node","react",
  "mongodb","sql","html","css","docker","aws"
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

  if (score < 50) suggestions.push("Improve keywords for ATS.");
  if (foundSkills.length < 5) suggestions.push("Add more skills.");
  if (!text.includes("project")) suggestions.push("Add projects.");
  if (!text.includes("experience")) suggestions.push("Add experience.");
  if (text.length < 300) suggestions.push("Increase content.");

  return {
    atsScore: Math.round(score),
    skills: foundSkills,
    missingSkills,
    suggestions,
  };
};