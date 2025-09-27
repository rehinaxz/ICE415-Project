// src/components/Starfield.jsx
import React, { useEffect, useRef } from "react";

const Starfield = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;

    let raf;
    const DPR = window.devicePixelRatio || 1;

    // Resize canvas to fill screen
    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * DPR));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * DPR));
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 0.6 + 0.4,
      r: Math.random() * 1.8 + 0.2,
    }));

    // Animation loop
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.globalAlpha = s.z;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        s.x += 0.05 * s.z; // slow horizontal drift
        if (s.x > canvas.width) s.x = 0;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.6 }}
    />
  );
};

export default Starfield;

