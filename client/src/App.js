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

      <div style={styles.card}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button onClick={upload} style={styles.button}>
          Upload Resume
        </button>
      </div>

      {loading && <p style={{ marginTop: 20 }}>⏳ Analyzing...</p>}

      {result && (
        <div style={styles.resultCard}>
          {/* ATS Score */}
          <h2>ATS Score</h2>
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
          <h3>✅ Skills</h3>
          <div style={styles.tags}>
            {result.skills.map((skill, i) => (
              <span key={i} style={styles.tagGreen}>{skill}</span>
            ))}
          </div>

          {/* Missing Skills */}
          <h3>❌ Missing Skills</h3>
          <div style={styles.tags}>
            {result.missingSkills.map((skill, i) => (
              <span key={i} style={styles.tagRed}>{skill}</span>
            ))}
          </div>

          {/* Suggestions */}
          <h3>💡 Suggestions</h3>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial",
    padding: "20px",
    background: "#f5f7fa",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "inline-block",
  },
  button: {
    padding: "10px 20px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "60%",
    marginInline: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  progressBar: {
    width: "100%",
    height: "25px",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "15px",
  },
  progressFill: {
    height: "100%",
    background: "green",
    color: "white",
    textAlign: "center",
    lineHeight: "25px",
  },
  tags: {
    marginBottom: "15px",
  },
  tagGreen: {
    background: "#4caf50",
    color: "white",
    padding: "5px 10px",
    margin: "5px",
    borderRadius: "5px",
    display: "inline-block",
  },
  tagRed: {
    background: "#f44336",
    color: "white",
    padding: "5px 10px",
    margin: "5px",
    borderRadius: "5px",
    display: "inline-block",
  },
};