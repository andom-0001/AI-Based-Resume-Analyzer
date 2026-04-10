export const generateResumeHTML = (data, template = "modern") => {
  if (template === "classic") return classicTemplate(data);
  if (template === "minimal") return minimalTemplate(data);
  return modernTemplate(data);
};

// 🔥 MODERN TEMPLATE
const modernTemplate = (data) => `
<div id="resume" style="font-family: Arial; padding: 20px;">
  <h1 style="color:#22c55e;">${data.name}</h1>
  <p>${data.email}</p>

  <h2>Summary</h2>
  <p>${rewriteSummary(data.skills)}</p>

  <h2>Skills</h2>
  <p>${data.skills.join(", ")}</p>

  <h2>Projects</h2>
  ${data.projects.map(p => `<p>• ${rewriteProject(p)}</p>`).join("")}

  <h2>Experience</h2>
  <p>${data.experience || "Fresher"}</p>

  <h2>Education</h2>
  <p>${data.education}</p>
</div>
`;

// 🧾 CLASSIC TEMPLATE
const classicTemplate = (data) => `
<div id="resume" style="font-family: Times New Roman; padding: 20px;">
  <h1>${data.name}</h1>
  <p>${data.email}</p>

  <hr/>

  <h3>Skills</h3>
  <ul>${data.skills.map(s => `<li>${s}</li>`).join("")}</ul>

  <h3>Projects</h3>
  <ul>${data.projects.map(p => `<li>${rewriteProject(p)}</li>`).join("")}</ul>

  <h3>Experience</h3>
  <p>${data.experience}</p>

  <h3>Education</h3>
  <p>${data.education}</p>
</div>
`;

// ⚡ MINIMAL TEMPLATE
const minimalTemplate = (data) => `
<div id="resume" style="font-family: sans-serif; padding: 20px;">
  <h1>${data.name}</h1>
  <p>${data.email}</p>

  <p><strong>Skills:</strong> ${data.skills.join(", ")}</p>
  <p><strong>Projects:</strong></p>
  ${data.projects.map(p => `<p>- ${p}</p>`).join("")}
</div>
`;

const rewriteSummary = (skills) =>
  `Developer skilled in ${skills.join(", ")} with strong problem-solving ability.`;

const rewriteProject = (text) =>
  `Built ${text} focusing on performance and scalability.`;