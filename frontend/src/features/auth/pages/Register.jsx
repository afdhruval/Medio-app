import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join Instaa" subtitle="Create your account">
      <form onSubmit={onSubmit}>
        {error && <ErrorBox msg={error} />}

        <Field name="username" type="text" placeholder="Username" value={form.username} onChange={onChange} />
        <Field name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} />
        <Field name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />

        <GradientBtn loading={loading} label="Sign Up" loadingLabel="Creating account…" />
      </form>

      <p style={linkRowStyle}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={linkStyle}>Log in</span>
      </p>
    </AuthLayout>
  );
}

/* ─── shared auth layout ──────────────────────────────────────── */
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={pageWrap}>
      <div className="fade-up" style={card}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={logoStyle}>instaa</h1>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── reusable sub-components ────────────────────────────────── */
export function Field({ name, type, placeholder, value, onChange, required = true }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = "#3a3a3a")}
      onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
    />
  );
}

export function GradientBtn({ loading, label, loadingLabel, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={loading}
      style={{
        ...btnBase,
        background: loading
          ? "#161616"
          : "linear-gradient(135deg,#f9ce34 0%,#ee2a7b 50%,#6228d7 100%)",
        color: loading ? "#444" : "#fff",
        cursor: loading ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span className="spinner" style={{ width: 14, height: 14, border: "2px solid #333", borderTopColor: "#666", borderRadius: "50%", display: "inline-block" }} />
          {loadingLabel}
        </span>
      ) : label}
    </button>
  );
}

export function ErrorBox({ msg }) {
  return (
    <div style={{
      background: "rgba(238,42,123,0.06)",
      border: "1px solid rgba(238,42,123,0.18)",
      borderRadius: 10,
      color: "#ee2a7b",
      fontSize: 13,
      padding: "10px 14px",
      marginBottom: 14,
    }}>{msg}</div>
  );
}

export function SuccessBox({ msg }) {
  return (
    <div style={{
      background: "rgba(0,200,100,0.06)",
      border: "1px solid rgba(0,200,100,0.18)",
      borderRadius: 10,
      color: "#00c864",
      fontSize: 13,
      padding: "10px 14px",
      marginBottom: 14,
    }}>{msg}</div>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const pageWrap = {
  minHeight: "100vh",
  background: "#0a0a0a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
};

const card = {
  width: "100%",
  maxWidth: 400,
  background: "#0f0f0f",
  border: "1px solid #1a1a1a",
  borderRadius: 20,
  padding: "36px 28px 28px",
};

const logoStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 46,
  fontWeight: 900,
  background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  margin: "0 0 6px",
  letterSpacing: "-1px",
};

const subtitleStyle = {
  color: "#444",
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  margin: 0,
};

const inputStyle = {
  display: "block",
  width: "100%",
  height: 50,
  background: "#141414",
  border: "1px solid #1e1e1e",
  borderRadius: 10,
  color: "#f0f0f0",
  fontSize: 14,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: 10,
  padding: "0 16px",
  transition: "border-color 0.2s",
};

const btnBase = {
  display: "block",
  width: "100%",
  height: 50,
  marginTop: 6,
  border: "none",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "0.04em",
  fontFamily: "'DM Sans', sans-serif",
  transition: "opacity 0.2s",
};

const linkRowStyle = { textAlign: "center", color: "#3a3a3a", fontSize: 13, marginTop: 20, marginBottom: 0 };
const linkStyle = { color: "#0095f6", cursor: "pointer", fontWeight: 600 };
