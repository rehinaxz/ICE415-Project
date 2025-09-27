// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Starfield from "../components/Starfield.jsx";

// Simple wrapper for page background + theme
const Page = ({ children, style }) => (
  <div
    style={{
      minHeight: "100vh",
      color: "white",
      background:
        "radial-gradient(1200px 600px at 20% 0%, #0b1b3a 0%, #050a18 60%, #02040a 100%)",
      overflow: "hidden",
      ...(style || {}),
    }}
  >
    {children}
  </div>
);

// Styled button for navigation
const Button = ({ to, children, variant = "primary" }) => {
  const common = {
    padding: "14px 20px",
    borderRadius: 14,
    fontWeight: 700,
    letterSpacing: 0.3,
    textDecoration: "none",
    display: "inline-block",
    transition: "transform .15s ease, box-shadow .15s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,.35)",
    margin: 8,
  };
  const styles = {
    primary: { background: "#7c3aed", color: "#fff" },
    ghost: {
      background: "rgba(255,255,255,.08)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.2)",
    },
  };
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <span style={{ ...common, ...styles[variant] }}>{children}</span>
    </Link>
  );
};

const LandingPage = () => (
  <Page>
    <Starfield />
    <div style={{ position: "relative", zIndex: 1, padding: "64px 24px" }}>
      <header style={{ textAlign: "center", marginTop: 40 }}>
        <h1
          style={{
            fontSize: 48,
            lineHeight: 1.1,
            marginBottom: 8,
            fontWeight: 800,
          }}
        >
          Welcome to <span style={{ color: "#a78bfa" }}>World Explorer</span>
        </h1>
        <p style={{ opacity: 0.85, maxWidth: 760, margin: "12px auto 0" }}>
          Explore countries on a 3D globe or play a quick guessing game.
        </p>
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 36,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Button to="/explore">🌍 Explore Countries</Button>
        <Button to="/play" variant="ghost">
          🎮 Play Game
        </Button>
      </div>
    </div>
  </Page>
);

export default LandingPage;
