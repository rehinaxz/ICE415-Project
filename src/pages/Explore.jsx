// src/pages/Explore.jsx
import React from "react";
import { Link } from "react-router-dom";
import GlobePage from "./GlobePage";

export default function Explore() {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">

      {/* Globe renders behind */}
      <div className="relative z-0 h-full">
        <GlobePage />
      </div>
    </div>
  );
}
