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

  // Maximize stars for a super dense field
  const COUNT = 1200;
  const stars = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() * 0.7 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.4 - 0.2),
    z: Math.random() * 0.6 + 0.4,
    r: Math.random() * 2.2 + 0.3,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.01
  }));

    // Maximize meteor showers
    const meteorShowers = [
      { interval: 120 + Math.random() * 80, angle: Math.PI / 6, color: '#fff' },
      { interval: 140 + Math.random() * 60, angle: Math.PI / 4, color: '#a78bfa' },
      { interval: 160 + Math.random() * 50, angle: Math.PI / 3, color: '#38bdf8' },
      { interval: 100 + Math.random() * 60, angle: Math.PI / 2.5, color: '#fbbf24' },
      { interval: 110 + Math.random() * 70, angle: Math.PI / 2, color: '#f87171' },
      { interval: 130 + Math.random() * 90, angle: Math.PI / 2.2, color: '#34d399' },
      { interval: 150 + Math.random() * 80, angle: Math.PI / 2.8, color: '#f472b6' },
      { interval: 170 + Math.random() * 60, angle: Math.PI / 2.1, color: '#facc15' }
    ];
    let meteorTimers = meteorShowers.map(m => m.interval);

    // Asteroids
    const ASTEROID_COUNT = 6;
    let asteroids = Array.from({ length: ASTEROID_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 1.2 - 0.6),
      r: Math.random() * 12 + 6,
      color: '#b0b0b0',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }));

    // Comets
    const COMET_COUNT = 3;
    let comets = Array.from({ length: COMET_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() * 2.5 + 1.5) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 1.4 - 0.7),
      r: Math.random() * 9 + 3,
      color: '#60a5fa',
      tail: Math.random() * 80 + 30,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03
    }));

    // Meteorites
    const METEORITE_COUNT = 4;
    let meteorites = Array.from({ length: METEORITE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() * 3 + 2) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 2.4 - 1.2),
      r: Math.random() * 8 + 2,
      color: '#f59e42',
      tail: Math.random() * 60 + 20,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // scatter and animate with rotation and speed variation
        s.x += s.vx * 2.2 * s.z;
        s.y += s.vy * 1.6 * s.z;
        s.rotation += s.rotationSpeed;

        // wrap around edges
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        // draw with rotation (for visual variety, but stars are circles)
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.z;
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();
      }

      // Multiple meteor showers
      meteorTimers.forEach((timer, i) => {
        meteorTimers[i]--;
        if (meteorTimers[i] <= 0) {
          const shower = meteorShowers[i];
          meteorTimers[i] = shower.interval;
          const sx = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
          const sy = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
          const len = 120 + Math.random() * 80;
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.strokeStyle = shower.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(
            sx - len * Math.cos(shower.angle),
            sy + len * Math.sin(shower.angle)
          );
          ctx.stroke();
          ctx.restore();
        }
      });

      // Asteroids
      asteroids.forEach(a => {
        a.x += a.vx * (0.7 + Math.random() * 0.6);
        a.y += a.vy * (0.7 + Math.random() * 0.6);
        a.rotation += a.rotationSpeed;
        if (a.x < -a.r || a.x > canvas.width + a.r || a.y < -a.r || a.y > canvas.height + a.r) {
          a.x = Math.random() * canvas.width;
          a.y = Math.random() * canvas.height;
        }
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.color;
        ctx.shadowColor = '#888';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      });

      // Comets
      comets.forEach(c => {
        c.x += c.vx * (0.7 + Math.random() * 0.6);
        c.y += c.vy * (0.7 + Math.random() * 0.6);
        c.rotation += c.rotationSpeed;
        if (c.x < -c.r || c.x > canvas.width + c.r || c.y < -c.r || c.y > canvas.height + c.r) {
          c.x = Math.random() * canvas.width;
          c.y = Math.random() * canvas.height;
        }
        // Tail
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-c.tail, c.tail * 0.2);
        ctx.stroke();
        ctx.restore();
        // Head
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      });

      // Meteorites
      meteorites.forEach(m => {
        m.x += m.vx * (0.7 + Math.random() * 0.6);
        m.y += m.vy * (0.7 + Math.random() * 0.6);
        m.rotation += m.rotationSpeed;
        if (m.x < -m.r || m.x > canvas.width + m.r || m.y < -m.r || m.y > canvas.height + m.r) {
          m.x = Math.random() * canvas.width;
          m.y = Math.random() * canvas.height;
        }
        // Tail
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-m.tail, m.tail * 0.3);
        ctx.stroke();
        ctx.restore();
        // Head
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

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
