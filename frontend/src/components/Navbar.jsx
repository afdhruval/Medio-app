import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../utils/auth";
import { FiMenu, FiX } from "react-icons/fi";
import img from "../../assets/peace-hand-chicken-emoticon-with-flat-design-vector-removebg-preview.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    clearUser();
    navigate("/register");
  };

  return (
    <>
      <header style={{
        position: "fixed",
        top: 12,
        left: 12,
        right: 12,
        zIndex: 200,
        height: 54,
        background: "#0d0d0d",
        border: "1px solid #1c1c1c",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <span
          onClick={() => { setMobileMenuOpen(false); navigate("/"); }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
            userSelect: "none",
            height:"70px",
            width:"70px"
          }}
        >
          <img src={img} alt="" />
        </span>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ alignItems: "center", gap: 28 }}>
          <NavLink onClick={() => navigate("/create")}>create post</NavLink>
          <NavLink onClick={logout}>log out</NavLink>
        </nav>

        {/* Hamburger Icon */}
        <button 
          className="mobile-hamburger" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: "#ececec", fontSize: 24, cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-hamburger" style={{
          position: "fixed", top: 76, left: 12, right: 12,
          background: "#111", border: "1px solid #1c1c1c", borderRadius: 16,
          padding: 16, zIndex: 199, display: "flex", flexDirection: "column", gap: 24
        }}>
          <NavLink onClick={() => { setMobileMenuOpen(false); navigate("/"); }}>home</NavLink><br /> <br />
          <NavLink onClick={() => { setMobileMenuOpen(false); navigate("/create"); }}>create post</NavLink> <br /> <br />
          <NavLink onClick={() => { setMobileMenuOpen(false); logout(); }}>log out</NavLink>
        </div>
      )}
    </>
  );
}

function NavLink({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        color: hovered ? "#f0f0f0" : "#555",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.2s",
      }}
    >
      {children}
    </button>
  );
}
