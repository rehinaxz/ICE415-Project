// src/components/SpaceBackdrop.jsx
import React, { useEffect, useRef } from "react";

/** Minimal, smooth starfield + occasional meteors for reuse */
export default function SpaceBackdrop({ opacity = 0.9, dense = true }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Stars opacity={opacity} dense={dense} />
      <Meteors />
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "40%",
          background:
            "linear-gradient(to bottom, rgba(2,4,10,.9), rgba(2,4,10,.55), rgba(2,4,10,0))",
        }}
      />
    </div>
  );
}

function Stars({ opacity = 0.9, dense }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * DPR));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * DPR));
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = dense ? 500 : 260;
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 0.7 + 0.3,
      r: Math.random() * 1.6 + 0.3,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.globalAlpha = s.z;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dense]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, opacity }}
      aria-hidden="true"
    />
  );
}

function Meteors() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * DPR));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * DPR));
    };
    resize();
    window.addEventListener("resize", resize);

    const meteors = [];
    let timer = 0;

    const spawn = () => {
      const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
      meteors.push({
        x: canvas.width + 50 * DPR,
        y,
        vx: -6 * DPR,
        vy: 1.8 * DPR,
        len: 140 * DPR,
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timer--;
      if (timer <= 0) {
        spawn();
        timer = 90 + Math.random() * 120;
      }

      meteors.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2 * DPR;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.len, m.y - m.len * 0.28);
        ctx.stroke();
        ctx.restore();
      });

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (m.x + m.len < 0 || m.y - m.len > canvas.height) meteors.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
