// src/pages/QuizGame.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SpaceBackdrop from "../components/SpaceBackdrop.jsx";

const TOTAL_ROUNDS = 10;

export default function QuizGame() {
  const [countries, setCountries] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState("loading"); // loading | asking | answer | summary

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,region,flags"
        );
        const data = await res.json();
        const cleaned = data
          .filter((c) => c?.name?.common)
          .map((c) => ({
            name: c.name.common,
            capital: Array.isArray(c.capital) ? c.capital[0] : c.capital || "—",
            region: c.region || "—",
            flag: c.flags?.svg || c.flags?.png,
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
      setQuestion(makeQuestion(countries));
      setSelected(null);
    }
  }, [countries, state, round]);

  const correct = useMemo(
    () => (question ? question.options[question.correctIndex] : null),
    [question]
  );

  function onSelect(i) {
    if (state !== "asking") return;
    setSelected(i);
    if (i === question.correctIndex) setScore((s) => s + 1);
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
        <h2 className="text-2xl font-extrabold">🧠 Country Quiz</h2>
        <Link to="/" className="btn-arcade">Back</Link>
      </header>

      {state === "loading" ? (
        <div className="grid place-items-center mt-20 opacity-80">Loading…</div>
      ) : state === "summary" ? (
        <Summary score={score} total={TOTAL_ROUNDS} />
      ) : (
        question && (
          <div className="mx-auto max-w-3xl px-5">
            <TopBar round={round} total={TOTAL_ROUNDS} score={score} />

            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-center">
              <p
                className="text-lg"
                style={{
                  fontFamily:
                    "'Quicksand','Inter','Segoe UI',Arial,sans-serif",
                }}
              >
                {question.text}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {question.options.map((opt, i) => {
                const isCorrect = state === "answer" && i === question.correctIndex;
                const isWrong = state === "answer" && i === selected && i !== question.correctIndex;
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

/* Helpers */

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
        <h3 className="text-2xl font-extrabold">Quiz Over</h3>
        <p className="mt-2">Final Score</p>
        <div className="my-2 text-4xl font-extrabold">
          {score}/{total}
        </div>
        <Link to="/" className="btn-arcade mt-2">Back Home</Link>
      </div>
    </div>
  );
}

function makeQuestion(countries) {
  // 50/50 mix of capital or region questions
  const askCapital = Math.random() < 0.5;
  const pool = countries.filter((c) => c.capital !== "—");
  const base = (askCapital && pool.length ? pool : countries)[
    Math.floor(Math.random() * (askCapital && pool.length ? pool.length : countries.length))
  ];

  if (askCapital) {
    const wrongs = shuffle(
      pool.filter((c) => c.name !== base.name).map((c) => c.capital)
    ).slice(0, 3);
    const options = shuffle([base.capital, ...wrongs]);
    return {
      text: `What is the capital of ${base.name}?`,
      options,
      correctIndex: options.indexOf(base.capital),
    };
  } else {
    const wrongs = shuffle(
      countries.filter((c) => c.region && c.region !== base.region).map((c) => c.region)
    )
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .slice(0, 3);
    const options = shuffle([base.region, ...wrongs]);
    return {
      text: `Which region does ${base.name} belong to?`,
      options,
      correctIndex: options.indexOf(base.region),
    };
  }
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
