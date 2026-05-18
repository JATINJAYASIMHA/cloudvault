import { useEffect, useState } from "react";

import axios from "axios";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

function App() {
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);

  const [progress, setProgress] = useState(0);

  const [user, setUser] = useState(null);

  const API =
    "https://cloudvault-backend-b1s5.onrender.com/api/files";

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API);

      setFiles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      setUser(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await signOut(auth);

    setUser(null);
  };

  const handleUpload = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      setProgress(0);

      const res = await axios.post(
        `${API}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );

            setProgress(percent);
          },
        }
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      fetchFiles();
    } catch (error) {
      console.log(error);
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
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#111827",
          padding: "30px 20px",
          borderRight:
            "1px solid rgba(255,255,255,0.1)",
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          <div style={menuStyle}>Dashboard</div>

          <div style={menuStyle}>My Files</div>

          <div style={menuStyle}>Shared Files</div>

          <div style={menuStyle}>Storage</div>

          <div style={menuStyle}>Settings</div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        {/* Auth Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          {!user ? (
            <button
              onClick={googleLogin}
              style={{
                background: "#ffffff",
                color: "#111827",
                border: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Sign in with Google
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <img
                src={user.photoURL}
                alt=""
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                }}
              />

              <p>{user.displayName}</p>

              <button
                onClick={logout}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <h2
          style={{
            fontSize: "38px",
            marginBottom: "10px",
          }}
        >
          Welcome Back 👋
        </h2>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Upload and manage your cloud files securely
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={cardStyle}>
            <h3>Total Files</h3>

            <p style={bigText}>
              {files.length}
            </p>
          </div>

          <div style={cardStyle}>
            <h3>Storage System</h3>

            <p style={bigText}>AWS S3</p>
          </div>

          <div style={cardStyle}>
            <h3>Database</h3>

            <p style={bigText}>MongoDB</p>
          </div>
        </div>

        {/* Upload Box */}
        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            padding: "40px",
            borderRadius: "20px",
            border:
              "2px dashed rgba(255,255,255,0.2)",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Upload Files
          </h2>

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            style={{
              marginBottom: "20px",
            }}
          />

          <br />

          <button
            onClick={handleUpload}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 30px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Uploading..."
              : "Upload File"}
          </button>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#1e293b",
              borderRadius: "10px",
              marginTop: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#3b82f6",
                transition: "0.3s",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "10px",
            }}
          >
            {progress}% Uploaded
          </p>

          {message && (
            <p
              style={{
                marginTop: "20px",
                color: "#4ade80",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Uploaded Files */}
        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Uploaded Files
          </h2>

          {files.map((file) => (
            <div
              key={file._id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div>
                <p>{file.originalName}</p>

                <small
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  {new Date(
                    file.uploadedAt
                  ).toLocaleString()}
                </small>
              </div>

              <div>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#60a5fa",
                    textDecoration: "none",
                    marginRight: "10px",
                  }}
                >
                  View
                </a>

                <button
                  onClick={() =>
                    handleDelete(file._id)
                  }
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const menuStyle = {
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  background: "rgba(255,255,255,0.05)",
};

const cardStyle = {
  flex: 1,
  background: "rgba(255,255,255,0.05)",
  padding: "25px",
  borderRadius: "18px",
};

const bigText = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px",
};

export default App;