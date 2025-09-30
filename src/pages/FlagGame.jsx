// src/pages/FlagGame.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SpaceBackdrop from "../components/SpaceBackdrop.jsx";

const TOTAL_ROUNDS = 10;

export default function FlagGame() {
  const [countries, setCountries] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState("loading"); // loading | asking | answer | summary

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,region"
        );
        const data = await res.json();
        const cleaned = data
          .filter((c) => c?.name?.common && (c.flags?.svg || c.flags?.png))
          .map((c) => ({
            name: c.name.common,
            flag: c.flags?.svg || c.flags?.png,
            region: c.region || "—",
          }));
        setCountries(cleaned);
        setState("asking");
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (countries.length && state === "asking") {
      setQ(makeFlagQuestion(countries));
      setSelected(null);
    }
  }, [countries, state, round]);

  const correct = useMemo(
    () => (q ? q.options[q.correctIndex] : null),
    [q]
  );

  function onSelect(i) {
    if (state !== "asking") return;
    setSelected(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
    setState("answer");
  }

  function next() {
    if (round >= TOTAL_ROUNDS) {
      setState("summary");
      return;
    }
    setRound((r) => r + 1);
    setState("asking");
  }

  return (
    <div className="relative min-h-screen text-white">
      <SpaceBackdrop dense />

      <header className="flex items-center justify-between p-5">
        <h2 className="text-2xl font-extrabold">🚩 Flag Guess</h2>
        <Link to="/" className="btn-arcade">Back</Link>
      </header>

      {state === "loading" ? (
        <div className="grid place-items-center mt-20 opacity-80">Loading…</div>
      ) : state === "summary" ? (
        <Summary score={score} total={TOTAL_ROUNDS} />
      ) : (
        q && (
          <div className="mx-auto max-w-3xl px-5">
            <TopBar round={round} total={TOTAL_ROUNDS} score={score} />

            <div className="mt-6 grid place-items-center">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <img
                  src={q.flag}
                  alt="Flag"
                  className="h-28 w-44 object-cover rounded"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {q.options.map((opt, i) => {
                const isCorrect = state === "answer" && i === q.correctIndex;
                const isWrong = state === "answer" && i === selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className="rounded-xl border border-white/15 bg-white/10 p-4 text-left transition hover:scale-[1.01]"
                    style={{
                      outline: "none",
                      ...(isCorrect
                        ? { background: "rgba(34,197,94,.85)" }
                        : isWrong
                        ? { background: "rgba(239,68,68,.75)" }
                        : {}),
                    }}
                  >
                    <span className="font-bold">{String.fromCharCode(65 + i)}.</span>{" "}
                    <span
                      style={{
                        fontFamily:
                          "'Quicksand','Inter','Segoe UI',Arial,sans-serif",
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {state === "answer" && (
              <div className="mt-4 text-center">
                <div className="opacity-80">
                  Correct answer: <b>{correct}</b>
                </div>
                <button className="btn-arcade mt-3" onClick={next}>
                  Next
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

/* UI bits reused */

function TopBar({ round, total, score }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge>Round: <b>{round}/{total}</b></Badge>
      <Badge>Score: <b>{score}</b></Badge>
    </div>
  );
}

function Badge({ children }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">
      {children}
    </div>
  );
}

function Summary({ score, total }) {
  return (
    <div className="grid place-items-center mt-12">
      <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center">
        <h3 className="text-2xl font-extrabold">Game Over</h3>
        <p className="mt-2">Final Score</p>
        <div className="my-2 text-4xl font-extrabold">
          {score}/{total}
        </div>
        <Link to="/" className="btn-arcade mt-2">Back Home</Link>
      </div>
    </div>
  );
}

function makeFlagQuestion(countries) {
  const base = countries[Math.floor(Math.random() * countries.length)];
  const wrongs = shuffle(
    countries.filter((c) => c.name !== base.name).map((c) => c.name)
  ).slice(0, 3);
  const options = shuffle([base.name, ...wrongs]);
  return {
    flag: base.flag,
    options,
    correctIndex: options.indexOf(base.name),
  };
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
