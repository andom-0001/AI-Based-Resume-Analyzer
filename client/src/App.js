import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 AI Resume Analyzer</h1>

      {/* Upload Card */}
      <div style={styles.card}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />
        <button onClick={upload} style={styles.button}>
          Analyze Resume
        </button>
      </div>

      {loading && <p style={styles.loading}>⏳ Analyzing your resume...</p>}

      {result && (
        <div style={styles.resultCard}>
          {/* Score */}
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
                <li key={i} style={{ marginBottom: "5px" }}>{s}</li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

/* 🔹 Reusable Components */

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
    textAlign: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    color: "#333",
  },

  title: {
    color: "white",
    marginBottom: "30px",
    fontSize: "2rem",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "inline-block",
  },

  input: {
    marginBottom: "15px",
  },

  button: {
    padding: "12px 25px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },

  loading: {
    color: "white",
    marginTop: "20px",
    fontSize: "18px",
  },

  resultCard: {
    marginTop: "30px",
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    width: "60%",
    marginInline: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "left",
  },

  progressBar: {
    width: "100%",
    height: "30px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "15px",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(to right, #22c55e, #16a34a)",
    color: "white",
    textAlign: "center",
    lineHeight: "30px",
    fontWeight: "bold",
    transition: "width 0.5s ease",
  },

  tag: {
    color: "white",
    padding: "6px 12px",
    margin: "5px",
    borderRadius: "20px",
    display: "inline-block",
    fontSize: "14px",
  },
};