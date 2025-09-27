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

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * DPR));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * DPR));
    };
    resize();
    window.addEventListener("resize", resize);

    // Faster, more dynamic stars
    const COUNT = 240;
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      // give some drift direction variance
      vx: (Math.random() * 0.5 + 0.35) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 0.25 - 0.125),
      z: Math.random() * 0.6 + 0.4, // brightness
      r: Math.random() * 1.8 + 0.4
    }));

    // occasional shooting star
    let shootTimer = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // speed factor — noticeably faster than before
        s.x += s.vx * 2.2 * s.z;
        s.y += s.vy * 1.6 * s.z;

        // wrap around edges
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        // draw
        ctx.beginPath();
        ctx.globalAlpha = s.z;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      // Shooting star every ~3–6 seconds
      if (--shootTimer <= 0) {
        shootTimer = 180 + Math.random() * 180;
        const sx = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        const sy = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        const len = 120 + Math.random() * 80;
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - len, sy + len * 0.2);
        ctx.stroke();
        ctx.restore();
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
      style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.7 }}
    />
  );
};

export default Starfield;
