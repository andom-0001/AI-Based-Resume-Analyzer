import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    projects: "",
    experience: "",
    education: "",
  });

  const [template, setTemplate] = useState("modern");
  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);
  const [resumeHTML, setResumeHTML] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // 🔹 GENERATE RESUME
  const generateResume = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/resume/generate",
      {
        ...form,
        template,
        skills: form.skills.split(","),
        projects: form.projects.split(","),
      }
    );

    setResult(res.data.analysis);
    setResumeHTML(res.data.resume);
    setPdfPreview(null); // clear PDF preview
  };

  // 🔹 UPLOAD RESUME (PDF)
  const uploadResume = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:3000/api/resume/upload",
      formData
    );

    setResult(res.data.data.analysis);

    // 🔥 PDF Preview
    const fileURL = URL.createObjectURL(file);
    setPdfPreview(fileURL);

    setResumeHTML(null);
  };

  // 🔹 DRAG HANDLERS
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // 🔹 DOWNLOAD GENERATED RESUME
  const downloadPDF = () => {
    const element = document.getElementById("resume");
    html2pdf().from(element).save("My_Resume.pdf");
  };

  // 🔹 CLEANUP
  useEffect(() => {
    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [pdfPreview]);

  return (
    <div style={styles.container}>
      <h1>🚀 ATS Resume Builder</h1>

      <div style={styles.grid}>
        
        {/* LEFT SIDE */}
        <div style={styles.card}>
          <h2>Create Resume</h2>

          {/* TEMPLATE */}
          <select
            onChange={(e) => setTemplate(e.target.value)}
            style={styles.input}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>

          {/* FORM */}
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              style={styles.input}
            />
          ))}

          <button style={styles.button} onClick={generateResume}>
            Generate Resume
          </button>

          <hr style={{ margin: "20px 0" }} />

          {/* DRAG & DROP */}
          <h2>Upload Resume</h2>

          <div
            style={{
              border: dragActive
                ? "2px dashed #22c55e"
                : "2px dashed #ccc",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <p>📂 Drag & Drop PDF Here</p>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button style={styles.button} onClick={uploadResume}>
              Analyze Resume
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.preview}>
          {/* GENERATED RESUME */}
          {resumeHTML ? (
            <>
              <div
                id="resume"
                dangerouslySetInnerHTML={{ __html: resumeHTML }}
              />

              <button style={styles.button} onClick={downloadPDF}>
                Download PDF
              </button>
            </>
          ) : pdfPreview ? (
            /* PDF PREVIEW */
            <iframe
              src={pdfPreview}
              width="100%"
              height="500px"
              title="PDF Preview"
            />
          ) : (
            <p>Preview will appear here</p>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.result}>
          <h2>📊 ATS Score: {result?.atsScore}%</h2>

          <h3>✅ Skills</h3>
          {result.skills.map((s, i) => (
            <span key={i} style={styles.green}>
              {s}
            </span>
          ))}

          <h3>❌ Missing Skills</h3>
          {result.missingSkills.map((s, i) => (
            <span key={i} style={styles.red}>
              {s}
            </span>
          ))}

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
    padding: "20px",
    fontFamily: "Segoe UI",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    color: "white",
    minHeight: "100vh",
  },

  grid: {
    display: "flex",
    gap: "20px",
  },

  card: {
    width: "40%",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  },

  preview: {
    width: "60%",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    color: "black",
  },

  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "white",
    marginTop: "10px",
  },

  result: {
    marginTop: "20px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
  },

  green: {
    background: "#22c55e",
    padding: "5px",
    margin: "5px",
    display: "inline-block",
  },

  red: {
    background: "#ef4444",
    padding: "5px",
    margin: "5px",
    display: "inline-block",
  },
};