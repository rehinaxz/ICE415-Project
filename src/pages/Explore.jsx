// src/pages/Explore.jsx
import React from "react";
import { Link } from "react-router-dom";
import GlobePage from "./GlobePage";

export default function Explore() {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Back button, always visible */}
      <div className="absolute top-4 left-4 z-50">
          <Link to="/" style={{
            padding: "14px 28px",
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 0.5,
            textDecoration: "none",
            display: "inline-block",
            margin: 8,
            cursor: "pointer",
            background: "#7c3aed",
            color: "#fff",
            border: "2.5px solid #4c1d95",
            boxShadow: "0 0 8px 2px #7c3aed, 0 0 16px 4px #7c3aed99, 0 0 2px #fff",
            outline: "none",
            transition: "background 0.3s cubic-bezier(.4,0,.2,1), color 0.3s cubic-bezier(.4,0,.2,1), border-color 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.4s cubic-bezier(.4,0,.2,1), transform .18s cubic-bezier(.4,0,.2,1)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#a78bfa";
            e.currentTarget.style.border = "2.5px solid #5b21b6";
            e.currentTarget.style.boxShadow = "0 0 16px 4px #a78bfa, 0 0 32px 8px #a78bfaBB, 0 0 8px 2px #fff";
            e.currentTarget.style.transform = "scale(1.07)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#7c3aed";
            e.currentTarget.style.border = "2.5px solid #4c1d95";
            e.currentTarget.style.boxShadow = "0 0 8px 2px #7c3aed, 0 0 16px 4px #7c3aed99, 0 0 2px #fff";
            e.currentTarget.style.transform = "scale(1)";
          }}
          tabIndex={0}
          >
            Back to Home
          </Link>
      </div>

      {/* Globe renders behind */}
      <div className="relative z-0 h-full">
        <GlobePage />
      </div>
    </div>
  );
}
