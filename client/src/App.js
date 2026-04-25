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

  // GENERATE
  const generateResume = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/resume/generate",
      {
        ...form,
        template,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        projects: form.projects.split(",").map(p => p.trim()).filter(Boolean),
      }
    );

    setResult(res.data.analysis);
    setResumeHTML(res.data.resume);
    setPdfPreview(null);
  };

  // UPLOAD
  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:3000/api/resume/upload",
      formData
    );

    setResult(res.data.data.analysis);
    setResumeHTML(null);

    const fileURL = URL.createObjectURL(file);
    setPdfPreview(fileURL);
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume");
    html2pdf().from(element).save();
  };

  useEffect(() => {
    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [pdfPreview]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 ATS Resume Builder And Analyzer</h1>

      <div style={styles.main}>
        
        {/* LEFT PANEL */}
        <div style={styles.sidebar}>
          <h2>Create Resume</h2>

          <select style={styles.input}
            onChange={(e)=>setTemplate(e.target.value)}>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>

          <Input label="Name" value={form.name}
            onChange={(v)=>setForm({...form,name:v})} />

          <Input label="Email" value={form.email}
            onChange={(v)=>setForm({...form,email:v})} />

          <Input label="Skills (comma separated)" value={form.skills}
            onChange={(v)=>setForm({...form,skills:v})} />

          <Input label="Projects" value={form.projects}
            onChange={(v)=>setForm({...form,projects:v})} />

          <Input label="Experience" value={form.experience}
            onChange={(v)=>setForm({...form,experience:v})} />

          <Input label="Education" value={form.education}
            onChange={(v)=>setForm({...form,education:v})} />

          <button style={styles.primaryBtn} onClick={generateResume}>
            Generate Resume
          </button>

          <div style={styles.divider}/>

          <h3>📄Upload Resume</h3>

          <div style={styles.drop}>
            <input type="file"
              onChange={(e)=>setFile(e.target.files[0])} />
            <button style={styles.secondaryBtn}
              onClick={uploadResume}>
              Analyze PDF
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.preview}>
          {resumeHTML ? (
            <>
              <div id="resume"
                dangerouslySetInnerHTML={{__html:resumeHTML}}/>
              <button style={styles.primaryBtn}
                onClick={downloadPDF}>
                Download PDF
              </button>
            </>
          ) : pdfPreview ? (
            <iframe
              title="Resume PDF Preview"
              src={pdfPreview}
              width="100%" height="600px"/>
          ) : (
            <div style={styles.empty}>
              <p>✨Your Resume Preview will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.result}>
          <h2>📊 ATS Score: {result.atsScore}%</h2>

          <h3>Skills</h3>
          <div>
            {result.skills.map((s,i)=>(
              <span key={i} style={styles.tagGreen}>{s}</span>
            ))}
          </div>

          <h3>Missing Skills</h3>
          <div>
            {result.missingSkills.map((s,i)=>(
              <span key={i} style={styles.tagRed}>{s}</span>
            ))}
          </div>

          <h3>Suggestions</h3>
          <ul>
            {result.suggestions.map((s,i)=>(
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 🔹 INPUT COMPONENT
const Input = ({ label, value, onChange }) => (
  <input
    placeholder={label}
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    style={styles.input}
  />
);

// 🎨 STYLES
const styles = {
  container:{
    background:"linear-gradient(135deg,#0f172a,#1e293b)",
    minHeight:"100vh",
    color:"white",
    padding:"20px"
  },

  title:{textAlign:"center",marginBottom:"20px"},

  main:{display:"flex",gap:"20px"},

  sidebar:{
    width:"30%",
    background:"rgba(255,255,255,0.05)",
    padding:"20px",
    borderRadius:"15px",
    backdropFilter:"blur(10px)"
  },

  preview:{
    width:"70%",
    background:"white",
    borderRadius:"15px",
    padding:"20px",
    color:"black"
  },

  input:{
    width:"100%",
    padding:"10px",
    margin:"8px 0",
    borderRadius:"8px",
    border:"none"
  },

  primaryBtn:{
    width:"100%",
    padding:"12px",
    background:"#22c55e",
    border:"none",
    borderRadius:"10px",
    marginTop:"10px",
    cursor:"pointer",
    color:"white",
    fontWeight:"bold"
  },

  secondaryBtn:{
    width:"100%",
    padding:"10px",
    background:"#3b82f6",
    border:"none",
    borderRadius:"10px",
    marginTop:"10px",
    color:"white"
  },

  drop:{
    marginTop:"10px",
    padding:"15px",
    border:"2px dashed #aaa",
    borderRadius:"10px",
    textAlign:"center"
  },

  divider:{
    height:"1px",
    background:"#555",
    margin:"20px 0"
  },

  empty:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100%"
  },

  result:{
    marginTop:"20px",
    background:"rgba(255,255,255,0.05)",
    padding:"20px",
    borderRadius:"15px"
  },

  tagGreen:{
    background:"#22c55e",
    padding:"5px 10px",
    margin:"5px",
    borderRadius:"5px",
    display:"inline-block"
  },

  tagRed:{
    background:"#ef4444",
    padding:"5px 10px",
    margin:"5px",
    borderRadius:"5px",
    display:"inline-block"
  }
};