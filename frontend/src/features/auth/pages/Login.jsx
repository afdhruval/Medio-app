import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { saveUser } from "../../../utils/auth";
import { AuthLayout, Field, GradientBtn, ErrorBox } from "./Register";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Backend returns { message, user: { username, email, bio, profileImage } }
      // and sets a cookie named "token" automatically
      const res = await api.post("/auth/login", form);
      saveUser(res.data.user);   // store user info for UI
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue">
      <form onSubmit={onSubmit}>
        {error && <ErrorBox msg={error} />}

        <Field name="email"    type="email"    placeholder="Email address" value={form.email}    onChange={onChange} />
        <Field name="password" type="password" placeholder="Password"      value={form.password} onChange={onChange} />

        <GradientBtn loading={loading} label="Log In" loadingLabel="Signing in…" />
      </form>

      <p style={{ textAlign: "center", color: "#3a3a3a", fontSize: 13, marginTop: 20, marginBottom: 0 }}>
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")} style={{ color: "#0095f6", cursor: "pointer", fontWeight: 600 }}>
          Sign up
        </span>
      </p>
    </AuthLayout>
  );
}
