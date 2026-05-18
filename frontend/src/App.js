import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
  try {
    const res = await axios.get(
      "https://cloudvault-backend-b1s5.onrender.com/api/files"
    );

    setFiles(res.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchFiles();
}, []);

const handleUpload = async () => {
  if (!file) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setLoading(true);

    const res = await axios.post(
      "https://cloudvault-backend-b1s5.onrender.com/api/files/upload",
      formData
    );

    setMessage(res.data.message);

    fetchFiles();
  } catch (error) {
    console.log(error);
    setMessage("Upload failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "250px",
          background: "#111827",
          padding: "30px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "50px",
            color: "#3b82f6",
          }}
        >
          CloudVault
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={menuStyle}>Dashboard</div>
          <div style={menuStyle}>My Files</div>
          <div style={menuStyle}>Shared</div>
          <div style={menuStyle}>Storage</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h2 style={{ fontSize: "40px" }}>
          Cloud Dashboard ☁
        </h2>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Securely upload and manage files
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "40px",
            borderRadius: "20px",
            marginBottom: "40px",
          }}
        >
          <h2>Upload File</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />

          <br />

          <button
            onClick={handleUpload}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 25px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>

          {message && (
            <p style={{ marginTop: "20px" }}>
              {message}
            </p>
          )}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            Uploaded Files
          </h2>

          {files.map((file) => (
            <div
              key={file._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div>
                <p>{file.originalName}</p>

                <small style={{ color: "#94a3b8" }}>
                  {new Date(
                    file.uploadedAt
                  ).toLocaleString()}
                </small>
              </div>

              <a
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                }}
              >
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const menuStyle = {
  padding: "14px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "10px",
  cursor: "pointer",
};

export default App;