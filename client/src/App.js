import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🆕 Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    projects: "",
    experience: "",
    education: "",
  });

  // 📤 Upload existing resume
  const upload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/resume/upload",
        formData
      );

      setResult(res.data.data.analysis);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Generate resume from form
  const generateResume = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/resume/generate",
        {
          ...form,
          skills: form.skills.split(",").map(s => s.trim()),
          projects: form.projects.split(",").map(p => p.trim()),
        }
      );

      setResult(res.data.analysis);

      // optional: show resume in console
      console.log(res.data.resume);

    } catch (err) {
      console.error(err);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 ATS Resume Builder</h1>

      {/* 🔥 MAIN GRID */}
      <div style={styles.grid}>

        {/* 📝 LEFT SIDE - FORM */}
        <div style={styles.card}>
          <h2>📝 Create Resume</h2>

          <input
            placeholder="Name"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            placeholder="Skills (comma separated)"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, skills: e.target.value })
            }
          />

          <input
            placeholder="Projects (comma separated)"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, projects: e.target.value })
            }
          />

          <input
            placeholder="Experience"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          />

          <input
            placeholder="Education"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, education: e.target.value })
            }
          />

          <button style={styles.button} onClick={generateResume}>
            Generate Resume
          </button>
        </div>

        {/* 📤 RIGHT SIDE - UPLOAD */}
        <div style={styles.card}>
          <h2>📤 Upload Resume</h2>

          <input
            type="file"
            style={styles.input}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button style={styles.button} onClick={upload}>
            Analyze Resume
          </button>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <p style={styles.loading}>⏳ Processing...</p>
      )}

      {/* 📊 RESULT */}
      {result && (
        <div style={styles.resultCard}>
          {/* ATS Score */}
          <h2>📊 ATS Score</h2>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${result.atsScore}%`,
              }}
            >
              {result.atsScore}%
            </div>
          </div>

          {/* Skills */}
          <Section title="✅ Skills">
            {result.skills.map((skill, i) => (
              <Tag key={i} text={skill} type="green" />
            ))}
          </Section>

          {/* Missing Skills */}
          <Section title="❌ Missing Skills">
            {result.missingSkills.map((skill, i) => (
              <Tag key={i} text={skill} type="red" />
            ))}
          </Section>

          {/* Suggestions */}
          <Section title="💡 Suggestions">
            <ul style={{ paddingLeft: "20px" }}>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

/* 🔹 Components */

const Section = ({ title, children }) => (
  <div style={{ marginTop: "20px" }}>
    <h3>{title}</h3>
    <div style={{ marginTop: "10px" }}>{children}</div>
  </div>
);

const Tag = ({ text, type }) => (
  <span
    style={{
      ...styles.tag,
      background: type === "green" ? "#22c55e" : "#ef4444",
    }}
  >
    {text}
  </span>
);

/* 🎨 Styles */

const styles = {
  container: {
    fontFamily: "Segoe UI",
    padding: "20px",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "30px",
  },

  grid: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },

  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  loading: {
    textAlign: "center",
    color: "white",
    marginTop: "20px",
  },

  resultCard: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "60%",
    marginInline: "auto",
  },

  progressBar: {
    width: "100%",
    height: "25px",
    background: "#eee",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "green",
    color: "white",
    textAlign: "center",
    lineHeight: "25px",
  },

  tag: {
    color: "white",
    padding: "5px 10px",
    margin: "5px",
    borderRadius: "20px",
    display: "inline-block",
  },
};