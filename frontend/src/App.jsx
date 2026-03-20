import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./utils/auth";
import Register  from "./features/auth/pages/Register";
import Login     from "./features/auth/pages/Login";
import Dashboard from "./features/posts/pages/Dashboard";
import CreatePost from "./features/posts/pages/CreatePost";

// Redirect to / if already logged in
const PublicOnly = ({ children }) =>
  isLoggedIn() ? <Navigate to="/" replace /> : children;

// Redirect to /login if NOT logged in
const Private = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/login" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/"         element={<Private><Dashboard /></Private>} />
        <Route path="/create"   element={<Private><CreatePost /></Private>} />
        {/* catch-all */}
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
