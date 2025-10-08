// Arcade button style and handlers for modal
const arcadeBtnStyle = {
  pointerEvents: 'auto',
  padding: '12px 22px',
  fontFamily: "'PressStart2P', 'Courier New', Courier, monospace",
  fontWeight: 'bold',
  fontSize: 15,
  letterSpacing: 2,
  background: 'linear-gradient(90deg, #0033FF 0%, #0600AB 60%, #00003D 100%)',
  color: '#fff',
  border: '3px solid #4c1d95',
  borderRadius: '10px 10px 8px 8px / 6px 6px 10px 10px',
  boxShadow: '0 4px 0 #0600AB, 0 0 0 2px #fff, 0 6px 12px 0 #0033FF55',
  outline: 'none',
  textShadow: '0 2px 0 #fff, 0 0 8px #0033FF99',
  filter: 'drop-shadow(0 2px 0 #0600AB) drop-shadow(0 0 8px #0033FF88)',
  transition: 'box-shadow 0.18s, filter 0.18s, background 0.18s, color 0.18s, transform 0.12s',
  cursor: 'pointer',
  minWidth: 90,
  margin: 0,
  userSelect: 'none',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

function arcadeBtnHover(e) {
  e.currentTarget.style.boxShadow = '0 4px 0 #0600AB, 0 0 0 2px #fff, 0 0 16px 4px #0033FF, 0 6px 12px 0 #0033FF55';
  e.currentTarget.style.filter = 'drop-shadow(0 0 8px #0033FFcc) drop-shadow(0 2px 0 #0600AB)';
  e.currentTarget.style.transform = 'scale(1.05)';
}
function arcadeBtnUnhover(e) {
  e.currentTarget.style.boxShadow = '0 4px 0 #0600AB, 0 0 0 2px #fff, 0 6px 12px 0 #0033FF55';
  e.currentTarget.style.filter = 'drop-shadow(0 2px 0 #0600AB) drop-shadow(0 0 8px #0033FF88)';
  e.currentTarget.style.transform = 'scale(1)';
}
function arcadeBtnDown(e) {
  e.currentTarget.style.transform = 'scale(0.95)';
  e.currentTarget.style.boxShadow = '0 2px 0 #0600AB, 0 0 0 2px #fff, 0 0 8px 2px #0033FF, 0 3px 6px 0 #0033FF55';
}
// src/pages/PlayGame.jsx
import React, { useEffect, useRef, useState } from "react";
import "../assets/arcade-font.css";
import { Link } from "react-router-dom";
import InteractiveGlobe from "../components/InteractiveGlobe"; // <-- your globe
// We won't use CountryInfo here; game only needs clicks

// 10 round game, two attempts per question
const TOTAL_ROUNDS = 3;

// Small question bank using demonyms
const QUESTIONS = [
  { prompt: "Which country do Filipinos live?", answer: "Philippines" },
  { prompt: "Where do Japanese live?", answer: "Japan" },
  { prompt: "Which country do Brazilians live?", answer: "Brazil" },
  { prompt: "Which country do Egyptians live?", answer: "Egypt" },
  { prompt: "Which country do Canadians live?", answer: "Canada" },
  { prompt: "Where do French people live?", answer: "France" },
  { prompt: "Which country do Indians live?", answer: "India" },
];

export default function PlayGame() {
  // ==== reuse your GlobePage data shape ====
  const [countries, setCountries] = useState({ features: [] });
  const [loading, setLoading] = useState(true);

  // ==== game state ====
  const [q, setQ] = useState(null);      // current question
  const [round, setRound] = useState(1); // 1..TOTAL_ROUNDS
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [state, setState] = useState("loading"); // loading | asking | wrong | correct | locked | summary
  const [showCorrect, setShowCorrect] = useState(false);

  // Handle correct state and auto-proceed to next question after 2 seconds
  useEffect(() => {
    if (state === "correct") {
      setShowCorrect(true);
      const timer = setTimeout(() => {
        setShowCorrect(false);
        nextQuestion(); // Automatically proceed to next question
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Debug state changes
  useEffect(() => {
    console.log("Game state changed to:", state);
  }, [state]);

  // ---- data fetch (copied pattern from your GlobePage; simplified) ----
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const geoJsonResponse = await fetch(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        );
        const geoJsonData = await geoJsonResponse.json();

        // Try REST Countries v3.1 minimal fields
        let countriesData = [];
        try {
          const resp = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,population,languages,capital,region"
          );
          if (resp.ok) countriesData = await resp.json();
        } catch (_) {
          countriesData = []; // fall back to basic names
        }

        // Map names for lookup (lowercased)
        const map = new Map();
        countriesData.forEach((c) => {
          if (c?.name?.common) map.set(c.name.common.toLowerCase(), c);
        });

        const features = geoJsonData.features.map((f) => {
          const name =
            f.properties?.NAME ||
            f.properties?.name ||
            f.properties?.ADMIN ||
            "Unknown Country";
          const found =
            map.get(name.toLowerCase()) ||
            null; // may be null; we’ll still allow clicking
          return {
            ...f,
            properties: {
              ...f.properties,
              name,
              countryData:
                  found ||
                  {
                    name: { common: name, official: name },
                    capital: [],
                    population: 0,
                    region: "—",
                    languages: {},
                  },
            },
          };
        });

        setCountries({ features });
      } catch (err) {
        console.error("Game: failed to load globe data", err);
      } finally {
        setLoading(false);
        startGame();
      }
    };
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- game control ----
  function randomQuestion() {
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  }
  function startGame() {
    setScore(0);
    setRound(1);
    setAttempts(0);
    setQ(randomQuestion());
    setState("asking");
  }
  function nextQuestion() {
    if (round >= TOTAL_ROUNDS) {
      setState("summary");
      return;
    }
    setRound((r) => r + 1);
    setAttempts(0);
    setQ(randomQuestion());
    setState("asking");
  }
  function tryAgainSameQuestion() {
    setAttempts(0);
    setState("asking");
  }

  // Called by your InteractiveGlobe; it sends a country object
  const onCountryClick = (countryData) => {
    if (state === "locked" || state === "summary" || !q) return;

    // Support both shapes: either a plain countryData (your GlobePage),
    // or a GeoJSON feature if InteractiveGlobe passes that.
    const clickedName =
      countryData?.name?.common ||
      countryData?.properties?.name ||
      countryData?.properties?.countryData?.name?.common ||
      "";

    const correct =
      clickedName.toLowerCase() === q.answer.toLowerCase();

    if (correct) {
      setScore((s) => s + 1);
      setState("correct");
      return;
    }
    setAttempts((a) => {
      const n = a + 1;
      if (n >= 2) setState("locked");
      else setState("wrong");
      return n;
    });
  };

  return (
    <>
      <div className="min-h-screen text-white relative"
         style={{
           background:
             "radial-gradient(1200px 600px at 20% 0%, #0b1b3a 0%, #050a18 60%, #02040a 100%)",
         }}>
        {/* Globe background that extends behind everything */}
        <div className="absolute inset-0 z-0">
          <InteractiveGlobe
            countries={countries}
            onCountryClick={onCountryClick}
            selectedCountry={null}
            loading={loading}
            onBackgroundClick={() => {}}
            hoverHighlightOnly={true}
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-md">
          <Link 
            to="/" 
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white font-bold text-lg shadow-lg hover:shadow-xl border border-purple-500 hover:border-purple-400 transform hover:scale-105 active:scale-95"
        >
          ← Back
        </Link>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent tracking-wider">
            GEOGRAPHY QUIZ
          </h2>
          <div className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white cursor-pointer border border-white/20">
            [Help]
          </div>
      </div>

        {/* Game Stats Section */}
        {state !== "summary" && (
          <div className="px-6 py-5 bg-gradient-to-r from-black/25 via-black/15 to-black/25 backdrop-blur-md">
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 justify-center">
                <span className="text-purple-300 font-semibold">Round:</span>
                <span className="text-white font-bold text-lg">{round}/{TOTAL_ROUNDS}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 justify-center">
                <span className="text-green-300 font-semibold">Score:</span>
                <span className="text-white font-bold text-lg">{score}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 justify-center">
                <span className="text-yellow-300 font-semibold">Attempts:</span>
                <span className="text-white font-bold text-lg">{Math.max(0, 2 - attempts)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Large Spacer - Forces space between stats and question */}
        {state !== "summary" && (
          <div style={{ height: '20px' }}></div>
        )}

        {/* Question Section */}
        {state !== "summary" && (
          <div className="px-6 py-8 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-md">
            <div className="text-center">
              <div className="text-2xl text-white font-bold tracking-wide leading-relaxed">
                {loading ? "Loading question…" : (q?.prompt || "Loading…")}
              </div>
              {/* Correct feedback that disappears after 3 seconds */}
              {showCorrect && (
                <div className="mt-4 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/50 backdrop-blur-sm">
                    <span className="text-green-300 font-semibold text-lg">✅ Correct!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {state === "summary" ? (
        <div className="grid place-items-center mt-10 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-white/10">
            <h3 className="text-2xl font-bold">Game Over</h3>
            <p className="mt-2">Final Score</p>
            <div className="text-4xl font-extrabold my-2">
              {score}/{TOTAL_ROUNDS}
            </div>
            {/* Play Again Button - Below Final Score */}
            <button
              onClick={startGame}
              style={{
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
              Play Again
            </button>
          </div>
      </div>
      ) : null}


      {state !== "summary" && (
        <>

          <div className="flex gap-3 px-5 mt-3 bg-black/20 backdrop-blur-sm py-3">
            {state === "wrong" && (
              <Pill className="bg-red-500/70">Incorrect. Try again!</Pill>
            )}
            {state === "locked" && (
              <Pill className="bg-red-600/80">
                ❌ Out of attempts. Try Again or go Next.
              </Pill>
            )}
          </div>

          {/* Globe Indicator */}


          {/* Arcade-style modal for game over/locked state */}
          {state === "locked" && (
            <div style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              background: 'rgba(10, 20, 60, 0.75)',
              backdropFilter: 'blur(2.5px)',
            }}>
              <div style={{
                minWidth: 360,
                maxWidth: 440,
                background: 'linear-gradient(135deg, #06102a 0%, #002a4d 100%)',
                border: '6px solid #00e0ff',
                borderRadius: '20px',
                boxShadow: '0 0 40px 10px #00e0ffcc, 0 12px 40px 0 #0033FFcc',
                padding: '38px 32px 30px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                fontFamily: "'PressStart2P', 'Courier New', Courier, monospace",
                position: 'relative',
              }}>
                {/* Close (X) button */}
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    width: 34,
                    height: 34,
                    background: 'linear-gradient(90deg, #00e0ff 0%, #0033FF 100%)',
                    color: '#fff',
                    fontFamily: "'PressStart2P', 'Courier New', Courier, monospace",
                    fontWeight: 'bold',
                    fontSize: 20,
                    border: '3px solid #00e0ff',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px 2px #00e0ff, 0 0 0 2px #fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'box-shadow 0.18s, filter 0.18s, background 0.18s, color 0.18s, transform 0.12s',
                    textShadow: '0 0 6px #00e0ff',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 0 20px 6px #00e0ff, 0 0 0 2px #fff';
                    e.currentTarget.style.transform = 'scale(1.10)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 0 10px 2px #00e0ff, 0 0 0 2px #fff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
                {/* GAME OVER title */}
                <div style={{
                  color: '#00e0ff',
                  fontSize: 28,
                  fontWeight: 'bold',
                  marginBottom: 18,
                  textShadow: '0 0 6px #00e0ff',
                  letterSpacing: 2,
                  textAlign: 'center',
                  marginTop: 8,
                  textTransform: 'uppercase',
                }}>
                  GAME OVER
                </div>
                {/* Do you want to continue? */}
                <div style={{
                  color: '#b6f6ff',
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginBottom: 28,
                  textShadow: '0 0 4px #00e0ff',
                  letterSpacing: 1.5,
                  textAlign: 'center',
                  fontFamily: "'PressStart2P', 'Courier New', Courier, monospace",
                }}>
                  Do you want to continue?
                </div>
                {/* Four buttons: Yes, No, Try Again, Next */}
                <div style={{ display: 'flex', gap: '18px', marginBottom: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* YES button */}
                  <button
                    onClick={startGame}
                    style={{
                      ...arcadeBtnStyle,
                      background: 'linear-gradient(90deg, #00e0ff 0%, #0033FF 100%)',
                      border: '3px solid #00e0ff',
                      color: '#fff',
                      boxShadow: '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99',
                      textShadow: '0 0 4px #00e0ff',
                      minWidth: 90,
                      fontSize: 15,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 0 24px 8px #00e0ff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px #00e0ffcc) drop-shadow(0 2px 0 #0033FF)';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 2px 0 #0033FF) drop-shadow(0 0 6px #00e0ff88)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={arcadeBtnDown}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                  >
                    YES
                  </button>
                  {/* NO button */}
                  <button
                    onClick={() => window.location.href = '/'}
                    style={{
                      ...arcadeBtnStyle,
                      background: 'linear-gradient(90deg, #0033FF 0%, #00e0ff 100%)',
                      border: '3px solid #00e0ff',
                      color: '#fff',
                      boxShadow: '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99',
                      textShadow: '0 0 4px #00e0ff',
                      minWidth: 90,
                      fontSize: 15,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 0 24px 8px #00e0ff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px #00e0ffcc) drop-shadow(0 2px 0 #0033FF)';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 2px 0 #0033FF) drop-shadow(0 0 6px #00e0ff88)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={arcadeBtnDown}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                  >
                    NO
                  </button>
                  {/* TRY AGAIN button */}
                  <button
                    onClick={tryAgainSameQuestion}
                    style={{
                      ...arcadeBtnStyle,
                      background: 'linear-gradient(90deg, #0033FF 0%, #00e0ff 100%)',
                      border: '3px solid #00e0ff',
                      color: '#fff',
                      boxShadow: '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99',
                      textShadow: '0 0 4px #00e0ff',
                      minWidth: 90,
                      fontSize: 15,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 0 24px 8px #00e0ff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px #00e0ffcc) drop-shadow(0 2px 0 #0033FF)';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 2px 0 #0033FF) drop-shadow(0 0 6px #00e0ff88)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={arcadeBtnDown}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                  >
                    TRY AGAIN
                  </button>
                  {/* NEXT button */}
                  <button
                    onClick={nextQuestion}
                    style={{
                      ...arcadeBtnStyle,
                      background: 'linear-gradient(90deg, #00e0ff 0%, #0033FF 100%)',
                      border: '3px solid #00e0ff',
                      color: '#fff',
                      boxShadow: '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99',
                      textShadow: '0 0 4px #00e0ff',
                      minWidth: 90,
                      fontSize: 15,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 0 24px 8px #00e0ff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px #00e0ffcc) drop-shadow(0 2px 0 #0033FF)';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 4px 0 #0033FF, 0 0 0 2px #fff, 0 6px 16px 0 #00e0ff99';
                      e.currentTarget.style.filter = 'drop-shadow(0 2px 0 #0033FF) drop-shadow(0 0 6px #00e0ff88)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={arcadeBtnDown}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
        </div>
      </div>

    </>
  );
}

function Badge({ children }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-white/10">
      {children}
    </div>
  );
}
function Pill({ children, className = "" }) {
  return (
    <span className={`px-3 py-2 rounded-lg ${className}`}>{children}</span>
  );
}
