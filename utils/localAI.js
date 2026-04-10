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

  if (score < 50) {
    suggestions.push("Your resume is weak for ATS. Add more keywords.");
  }

  if (foundSkills.length < 5) {
    suggestions.push("Add more technical skills.");
  }

  if (!text.includes("project")) {
    suggestions.push("Add strong projects.");
  }

  if (!text.includes("experience")) {
    suggestions.push("Add experience or internship.");
  }

  if (!text.includes("github")) {
    suggestions.push("Add GitHub profile.");
  }

  if (text.length < 300) {
    suggestions.push("Increase resume content.");
  }

  return {
    atsScore: Math.round(score),
    skills: foundSkills,
    missingSkills,
    suggestions,
  };
};