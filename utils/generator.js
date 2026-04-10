export const generateResumeHTML = (data, template = "modern") => {
  if (template === "classic") return classicTemplate(data);
  if (template === "minimal") return minimalTemplate(data);
  return modernTemplate(data);
};

const modernTemplate = (data) => `
<div id="resume" style="font-family: Arial; padding: 30px; max-width: 800px; margin:auto;">

  <h1>${data.name || "Your Name"}</h1>
  <p style="color:gray;">${data.email || ""}</p>

  <hr/>

  <h2>Summary</h2>
  <p>${rewriteSummary(data.skills)}</p>

  <h2>Skills</h2>
  <div>
    ${data.skills.map(s => `<span style="background:#22c55e;color:white;padding:5px 10px;margin:5px;border-radius:5px;">${s}</span>`).join("")}
  </div>

  <h2>Projects</h2>
  <ul>
    ${data.projects.map(p => `<li>${rewriteProject(p)}</li>`).join("")}
  </ul>

  <h2>Experience</h2>
  <p>${data.experience || "Fresher"}</p>

  <h2>Education</h2>
  <p>${data.education || "-"}</p>

</div>
`;

const classicTemplate = (data) => `
<div id="resume" style="font-family: Times New Roman; padding:20px;">
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

const minimalTemplate = (data) => `
<div id="resume" style="padding:20px;">
  <h1>${data.name}</h1>
  <p>${data.email}</p>

  <p><b>Skills:</b> ${data.skills.join(", ")}</p>
  <p><b>Projects:</b></p>
  ${data.projects.map(p => `<p>- ${p}</p>`).join("")}
</div>
`;

const rewriteSummary = (skills = []) => {
  if (!skills.length) {
    return "Motivated developer with strong problem-solving ability.";
  }
  return `Developer skilled in ${skills.join(", ")} with strong problem-solving ability.`;
};

const rewriteProject = (text) =>
  `Developed ${text} focusing on performance, scalability, and user experience.`;