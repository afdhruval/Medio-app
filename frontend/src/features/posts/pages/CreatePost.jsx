import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import { getUser } from "../../../utils/auth";
import { Avatar } from "../../../components/LeftSidebar";

export default function CreatePost() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);
  const user = getUser();

  const [caption,   setCaption]   = useState("");
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select an image."); return; }
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // POST /api/post  — multipart/form-data (multer + imagekit)
      const fd = new FormData();
      fd.append("image",   file);
      fd.append("caption", caption);

      await axios.post("/api/post", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Post published! Redirecting…");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Navbar />

      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "80px 16px 40px",
      }}>
        <div className="fade-up" style={{ width: "100%", maxWidth: 520 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 22px",
            letterSpacing: "-0.5px",
          }}>
            Create Post
          </h2>

          <div style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: 20,
            overflow: "hidden",
          }}>
            {/* Status messages */}
            {error && (
              <div style={msgStyle("#ee2a7b", "rgba(238,42,123,0.06)", "rgba(238,42,123,0.15)")}>
                {error}
              </div>
            )}
            {success && (
              <div style={msgStyle("#00c864", "rgba(0,200,100,0.06)", "rgba(0,200,100,0.15)")}>
                {success}
              </div>
            )}

            <form onSubmit={onSubmit} style={{ padding: "26px 22px 22px" }}>

              {/* ── User Avatar ── */}
              {user && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <Avatar src={user.profileImage} name={user.username} size={36} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#ececec" }}>{user.username}</span>
                </div>
              )}

              {/* ── Image upload area ── */}
              <FieldLabel>Image <span style={{ color: "#2e2e2e", fontWeight: 400 }}>(required)</span></FieldLabel>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  background: "#080808",
                  border: "2px dashed #1e1e1e",
                  borderRadius: 12,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#333")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
              >
                {preview ? (
                  <img
                    src={preview} alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#333" }}>Click to choose an image</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#222" }}>JPG, PNG, GIF, WEBP</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />

              {/* ── Caption ── */}
              <FieldLabel>Caption</FieldLabel>
              <textarea
                placeholder="Write a caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                style={{
                  display: "block",
                  width: "100%",
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: 10,
                  color: "#f0f0f0",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 20,
                  padding: "12px 14px",
                  resize: "none",
                  lineHeight: 1.6,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#333")}
                onBlur={(e)  => (e.target.style.borderColor = "#1e1e1e")}
              />

              {/* ── Buttons ── */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  style={{
                    flex: 1,
                    height: 48,
                    background: "none",
                    border: "1px solid #1e1e1e",
                    borderRadius: 12,
                    color: "#444",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#2e2e2e"; e.target.style.color = "#888"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#1e1e1e"; e.target.style.color = "#444"; }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !file}
                  style={{
                    flex: 2,
                    height: 48,
                    background: loading || !file
                      ? "#111"
                      : "linear-gradient(135deg,#f9ce34 0%,#ee2a7b 50%,#6228d7 100%)",
                    color: loading || !file ? "#333" : "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading || !file ? "not-allowed" : "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!loading && file) e.target.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span className="spinner" style={{
                        width: 14, height: 14,
                        border: "2px solid #2a2a2a",
                        borderTopColor: "#555",
                        borderRadius: "50%",
                        display: "inline-block",
                      }} />
                      Uploading…
                    </span>
                  ) : "Share Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <p style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#3a3a3a",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      margin: "0 0 8px",
    }}>
      {children}
    </p>
  );
}

function msgStyle(color, bg, border) {
  return {
    background: bg,
    borderBottom: `1px solid ${border}`,
    color,
    fontSize: 13,
    padding: "11px 22px",
  };
}
