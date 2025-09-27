// src/pages/PlayGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import InteractiveGlobe from "../components/InteractiveGlobe"; // <-- your globe
// We won't use CountryInfo here; game only needs clicks

// 10 round game, two attempts per question
const TOTAL_ROUNDS = 10;

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
    <div className="min-h-screen text-white"
         style={{
           background:
             "radial-gradient(1200px 600px at 20% 0%, #0b1b3a 0%, #050a18 60%, #02040a 100%)",
         }}>
      <div className="flex items-center justify-between p-5">
        <h2 className="text-2xl font-extrabold">🎮 Play Game</h2>
        <Link to="/" className="text-violet-300">← Back</Link>
      </div>

      {state !== "summary" && (
        <div className="flex flex-wrap gap-3 px-5">
          <Badge>Round: <b>{round}/{TOTAL_ROUNDS}</b></Badge>
          <Badge>Score: <b>{score}</b></Badge>
          <Badge>Attempts Left: <b>{Math.max(0, 2 - attempts)}</b></Badge>
          <button
            onClick={startGame}
            className="px-3 py-2 rounded-lg border border-white/20 bg-white/10"
          >
            ↻ Restart
          </button>
        </div>
      )}

      {state === "summary" ? (
        <div className="grid place-items-center mt-10 text-center">
          <div className="max-w-md p-6 rounded-2xl border border-white/15 bg-white/10">
            <h3 className="text-2xl font-bold">Game Over</h3>
            <p className="mt-2">Final Score</p>
            <div className="text-4xl font-extrabold my-2">
              {score}/{TOTAL_ROUNDS}
            </div>
            <div className="flex gap-3 justify-center mt-2">
              <button onClick={startGame}
                      className="px-4 py-2 rounded-lg bg-violet-600">
                Play Again
              </button>
              <Link to="/"
                    className="px-4 py-2 rounded-lg border border-white/20 bg-white/10">
                Back Home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-5 mt-3 text-lg">
            {loading ? "Loading question…" : (q?.prompt || "Loading…")}
          </div>

          {/* Reuse your globe, pass the props it expects */}
          <div className="px-2">
            <InteractiveGlobe
              countries={countries}
              onCountryClick={onCountryClick}
              selectedCountry={null}        // game doesn’t need side panel
              loading={loading}
              onBackgroundClick={() => {}}
            />
          </div>

          <div className="flex gap-3 px-5 mt-3">
            {state === "wrong" && (
              <Pill className="bg-red-500/70">Incorrect. Try again!</Pill>
            )}
            {state === "locked" && (
              <Pill className="bg-red-600/80">
                ❌ Out of attempts. Try Again or go Next.
              </Pill>
            )}
            {state === "correct" && (
              <Pill className="bg-green-600/80">✅ Correct!</Pill>
            )}
          </div>

          <div className="flex gap-3 px-5 mt-3">
            {state === "locked" && (
              <button onClick={tryAgainSameQuestion}
                      className="px-4 py-2 rounded-lg border border-white/20 bg-white/10">
                Try Again
              </button>
            )}
            {(state === "locked" || state === "correct") && (
              <button onClick={nextQuestion}
                      className="px-4 py-2 rounded-lg bg-violet-600">
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Badge({ children }) {
  return (
    <div className="px-3 py-2 rounded-lg border border-white/15 bg-white/10">
      {children}
    </div>
  );
}
function Pill({ children, className = "" }) {
  return (
    <span className={`px-3 py-2 rounded-lg ${className}`}>{children}</span>
  );
}
