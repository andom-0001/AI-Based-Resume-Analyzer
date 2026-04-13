import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default function App() {
  // 🔐 AUTH STATE
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 📄 RESUME STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    projects: "",
    experience: "",
    education: "",
  });

  const [template, setTemplate] = useState("modern");
  const [theme, setTheme] = useState("green");

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [resumeHTML, setResumeHTML] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  // 🔑 TOKEN
  const token = localStorage.getItem("token");
  const headers = { Authorization: token };

  // 🔐 HANDLE AUTH
  const handleAuth = async () => {
    const url =
      authMode === "login"
        ? "http://localhost:3000/api/auth/login"
        : "http://localhost:3000/api/auth/signup";

    const res = await axios.post(url, authData);

    if (authMode === "login") {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } else {
      alert("Signup successful, now login");
      setAuthMode("login");
    }
  };

  // 🔓 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 GENERATE RESUME
  const generateResume = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/resume/generate",
      {
        ...form,
        template,
        theme,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        projects: form.projects.split(",").map(p => p.trim()).filter(Boolean),
      },
      { headers }
    );

    setResult(res.data.analysis);
    setResumeHTML(res.data.resume);
    setPdfPreview(null);
  };

  // 🔹 UPLOAD RESUME
  const uploadResume = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:3000/api/resume/upload",
      formData,
      { headers }
    );

    setResult(res.data.analysis);
    setResumeHTML(null);

    const fileURL = URL.createObjectURL(file);
    setPdfPreview(fileURL);
  };

  // 🔹 DOWNLOAD
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

  // 🔐 AUTH UI
  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2>{authMode === "login" ? "Login" : "Signup"}</h2>

          {authMode === "signup" && (
            <input
              placeholder="Name"
              style={styles.input}
              onChange={(e) =>
                setAuthData({ ...authData, name: e.target.value })
              }
            />
          )}

          <input
            placeholder="Email"
            style={styles.input}
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
          />

          <button style={styles.primaryBtn} onClick={handleAuth}>
            {authMode === "login" ? "Login" : "Signup"}
          </button>

          <p
            style={{ cursor: "pointer" }}
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            Switch to {authMode === "login" ? "Signup" : "Login"}
          </p>
        </div>
      </div>
    );
  }

  // 🧾 MAIN UI
  return (
    <div style={styles.container}>
      <h1>🚀 ATS Resume Builder</h1>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>

      <div style={styles.grid}>
        {/* LEFT */}
        <div style={styles.card}>
          <h2>Create Resume</h2>

          {/* TEMPLATE */}
          <select style={styles.input}
            onChange={(e)=>setTemplate(e.target.value)}>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>

          {/* THEME */}
          <select style={styles.input}
            onChange={(e)=>setTheme(e.target.value)}>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="dark">Dark</option>
          </select>

          {/* FORM */}
          <input placeholder="Name" value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            style={styles.input}/>

          <input placeholder="Email" value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            style={styles.input}/>

          <input placeholder="Skills (comma separated)" value={form.skills}
            onChange={(e)=>setForm({...form,skills:e.target.value})}
            style={styles.input}/>

          <input placeholder="Projects" value={form.projects}
            onChange={(e)=>setForm({...form,projects:e.target.value})}
            style={styles.input}/>

          <input placeholder="Experience" value={form.experience}
            onChange={(e)=>setForm({...form,experience:e.target.value})}
            style={styles.input}/>

          <input placeholder="Education" value={form.education}
            onChange={(e)=>setForm({...form,education:e.target.value})}
            style={styles.input}/>

          <button style={styles.primaryBtn} onClick={generateResume}>
            Generate Resume
          </button>

          <hr/>

          {/* UPLOAD */}
          <h3>Upload Resume</h3>

          <input type="file"
            onChange={(e)=>setFile(e.target.files[0])}/>

          <button style={styles.secondaryBtn} onClick={uploadResume}>
            Analyze PDF
          </button>
        </div>

        {/* RIGHT */}
        <div style={styles.preview}>
          {resumeHTML ? (
            <>
              <div id="resume"
                dangerouslySetInnerHTML={{ __html: resumeHTML }} />
              <button style={styles.primaryBtn}
                onClick={downloadPDF}>
                Download PDF
              </button>
            </>
          ) : pdfPreview ? (
            <iframe src={pdfPreview} width="100%" height="600px"/>
          ) : (
            <p>Preview will appear here</p>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.result}>
          <h2>📊 ATS Score: {result?.atsScore}%</h2>

          <h3>Skills</h3>
          {result.skills.map((s,i)=>(
            <span key={i} style={styles.green}>{s}</span>
          ))}

          <h3>Missing Skills</h3>
          {result.missingSkills.map((s,i)=>(
            <span key={i} style={styles.red}>{s}</span>
          ))}

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

// 🎨 STYLES
const styles = {
  container:{padding:"20px",background:"#0f172a",color:"white",minHeight:"100vh"},
  grid:{display:"flex",gap:"20px"},
  card:{width:"40%",background:"#1e293b",padding:"20px",borderRadius:"10px"},
  preview:{width:"60%",background:"white",color:"black",padding:"20px",borderRadius:"10px"},
  input:{width:"100%",padding:"10px",margin:"8px 0",borderRadius:"8px"},
  primaryBtn:{padding:"10px",background:"#22c55e",border:"none",borderRadius:"8px",color:"white",marginTop:"10px"},
  secondaryBtn:{padding:"10px",background:"#3b82f6",border:"none",borderRadius:"8px",color:"white",marginTop:"10px"},
  result:{marginTop:"20px",background:"#1e293b",padding:"20px",borderRadius:"10px"},
  green:{background:"#22c55e",padding:"5px",margin:"5px"},
  red:{background:"#ef4444",padding:"5px",margin:"5px"},
  logout:{float:"right"},
  authContainer:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},
  authBox:{background:"white",color:"black",padding:"20px",borderRadius:"10px"}
};