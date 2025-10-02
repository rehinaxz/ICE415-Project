// src/pages/Explore.jsx
import React from "react";
import "../assets/arcade-font.css";
import { Link } from "react-router-dom";
import GlobePage from "./GlobePage";

export default function Explore() {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Back button, arcade pixel style, fixed middle-left */}
      <div style={{
        position: "fixed",
        left: 50,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none"
      }}>
        <Link
          to="/"
          tabIndex={0}
          style={{
            pointerEvents: "auto",
            padding: "18px 38px 16px 38px",
            fontFamily: "'PressStart2P', 'Courier New', Courier, monospace",
            fontWeight: "bold",
            fontSize: 20,
            letterSpacing: 2,
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            background: "linear-gradient(90deg, #FFE5F1 0%, #F042FF 100%)",
            color: "#3b0a45",
            border: "4px solid #4c1d95",
            borderRadius: "12px 12px 10px 10px / 8px 8px 12px 12px", // pixel-style corners
            boxShadow: "0 8px 0 #4c1d95, 0 0 0 4px #fff, 0 12px 18px 0 #3b0a4533",
            outline: "none",
            textShadow: "0 2px 0 #fff, 0 0 8px #F042FF99",
            filter: "drop-shadow(0 4px 0 #4c1d95) drop-shadow(0 0 12px #F042FF88)",
            transition: "box-shadow 0.18s, filter 0.18s, background 0.18s, color 0.18s, transform 0.12s",
            position: "relative",
            userSelect: "none",
            minWidth: 120,
            textAlign: "center",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 8px 0 #4c1d95, 0 0 0 4px #fff, 0 0 32px 8px #F042FF, 0 12px 18px 0 #3b0a4533";
            e.currentTarget.style.filter = "drop-shadow(0 0 16px #F042FFcc) drop-shadow(0 4px 0 #4c1d95)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "0 8px 0 #4c1d95, 0 0 0 4px #fff, 0 12px 18px 0 #3b0a4533";
            e.currentTarget.style.filter = "drop-shadow(0 4px 0 #4c1d95) drop-shadow(0 0 12px #F042FF88)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = "scale(0.95)";
            e.currentTarget.style.boxShadow = "0 4px 0 #4c1d95, 0 0 0 4px #fff, 0 0 16px 4px #F042FF, 0 8px 12px 0 #3b0a4533";
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 0 #4c1d95, 0 0 0 4px #fff, 0 0 32px 8px #F042FF, 0 12px 18px 0 #3b0a4533";
          }}
        >
          BACK
        </Link>
      </div>

      {/* Globe renders behind */}
      <div className="relative z-0 h-full">
        <GlobePage />
      </div>
    </div>
  );
}
