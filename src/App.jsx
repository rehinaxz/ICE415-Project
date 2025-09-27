// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Use your existing Explore page:
import GlobePage from "./pages/GlobePage";

// New pages we added:
import LandingPage from "./pages/LandingPage.jsx";
import PlayGame from "./pages/PlayGame.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Home */}
        <Route path="/" element={<LandingPage />} />

        {/* Explore Countries (uses your current globe implementation) */}
        <Route path="/explore" element={<GlobePage />} />

        {/* Guessing Game (2 attempts, 10 rounds, final summary) */}
        <Route path="/play" element={<PlayGame />} />

        {/* Optional: fallback to home if route not found */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
