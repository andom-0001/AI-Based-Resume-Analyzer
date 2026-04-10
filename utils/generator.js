export const generateResume = (data) => {
  return `
${data.name}
${data.email}

SUMMARY
A passionate developer skilled in ${data.skills.join(", ")}

SKILLS
${data.skills.join(", ")}

PROJECTS
${data.projects.map(p => "- " + p).join("\n")}

EXPERIENCE
${data.experience || "Fresher"}

EDUCATION
${data.education}
`;
};