// src/pages/Explore.jsx
import React from "react";
import { Link } from "react-router-dom";
import GlobePage from "./GlobePage";

export default function Explore() {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Back button, always visible */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="px-4 py-2 rounded-lg font-semibold text-white
                     bg-violet-600/90 hover:bg-violet-500
                     border border-violet-400/30 shadow-lg
                     transition transform hover:scale-105"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Globe renders behind */}
      <div className="relative z-0 h-full">
        <GlobePage />
      </div>
    </div>
  );
}
