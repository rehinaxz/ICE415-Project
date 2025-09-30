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

    // Solar system planets config
    const sun = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 32 * DPR,
      color: '#fde047'
    };
    const planets = [
      { radius: 70 * DPR, size: 10 * DPR, color: '#60a5fa', speed: 0.008, angle: Math.random() * Math.PI * 2 }, // Mercury
      { radius: 110 * DPR, size: 14 * DPR, color: '#fbbf24', speed: 0.006, angle: Math.random() * Math.PI * 2 }, // Venus
      { radius: 160 * DPR, size: 16 * DPR, color: '#34d399', speed: 0.004, angle: Math.random() * Math.PI * 2 }, // Earth
      { radius: 220 * DPR, size: 12 * DPR, color: '#f87171', speed: 0.003, angle: Math.random() * Math.PI * 2 }, // Mars
      { radius: 300 * DPR, size: 22 * DPR, color: '#a78bfa', speed: 0.002, angle: Math.random() * Math.PI * 2 }, // Jupiter
      { radius: 380 * DPR, size: 18 * DPR, color: '#f59e42', speed: 0.0015, angle: Math.random() * Math.PI * 2 }, // Saturn
      { radius: 460 * DPR, size: 15 * DPR, color: '#38bdf8', speed: 0.0012, angle: Math.random() * Math.PI * 2 }, // Uranus
      { radius: 540 * DPR, size: 13 * DPR, color: '#64748b', speed: 0.001, angle: Math.random() * Math.PI * 2 }  // Neptune
    ];

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw solar system
      // Sun
      ctx.save();
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
      ctx.fillStyle = sun.color;
      ctx.shadowColor = sun.color;
      ctx.shadowBlur = 40;
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.restore();

      // Planets and orbits
      planets.forEach((planet, i) => {
        // Orbit path
        ctx.save();
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();

        // Animate planet position
        planet.angle += planet.speed;
        const px = sun.x + planet.radius * Math.cos(planet.angle);
        const py = sun.y + planet.radius * Math.sin(planet.angle);

        // Draw planet with unique design
        ctx.save();
        ctx.globalAlpha = 0.97;
        ctx.translate(px, py);
        switch (i) {
          case 0: // Mercury: radial gradient, crater dots
            {
              const grad = ctx.createRadialGradient(0, 0, planet.size * 0.2, 0, 0, planet.size);
              grad.addColorStop(0, '#e5e7eb');
              grad.addColorStop(1, planet.color);
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.shadowColor = '#e5e7eb';
              ctx.shadowBlur = 8;
              ctx.fill();
              // craters
              ctx.globalAlpha = 0.5;
              for (let j = 0; j < 5; j++) {
                ctx.beginPath();
                ctx.arc(
                  Math.cos(j) * planet.size * 0.6,
                  Math.sin(j) * planet.size * 0.6,
                  planet.size * 0.18,
                  0,
                  Math.PI * 2
                );
                ctx.fillStyle = '#b6b6b6';
                ctx.fill();
              }
            }
            break;
          case 1: // Venus: subtle stripes
            {
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = planet.color;
              ctx.shadowColor = planet.color;
              ctx.shadowBlur = 12;
              ctx.fill();
              ctx.globalAlpha = 0.3;
              for (let j = -2; j <= 2; j++) {
                ctx.beginPath();
                ctx.ellipse(0, j * planet.size * 0.3, planet.size * 0.9, planet.size * 0.18, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fffbe8';
                ctx.fill();
              }
            }
            break;
          case 2: // Earth: blue/green gradient, continents
            {
              const grad = ctx.createRadialGradient(0, 0, planet.size * 0.2, 0, 0, planet.size);
              grad.addColorStop(0, '#38bdf8');
              grad.addColorStop(0.7, '#34d399');
              grad.addColorStop(1, planet.color);
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 14;
              ctx.fill();
              // continents
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.arc(-planet.size * 0.3, -planet.size * 0.2, planet.size * 0.35, 0, Math.PI * 2);
              ctx.arc(planet.size * 0.2, planet.size * 0.3, planet.size * 0.22, 0, Math.PI * 2);
              ctx.fillStyle = '#a3e635';
              ctx.fill();
            }
            break;
          case 3: // Mars: orange gradient, stripes
            {
              const grad = ctx.createRadialGradient(0, 0, planet.size * 0.2, 0, 0, planet.size);
              grad.addColorStop(0, '#f87171');
              grad.addColorStop(1, planet.color);
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.shadowColor = '#f87171';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.globalAlpha = 0.3;
              for (let j = -1; j <= 1; j++) {
                ctx.beginPath();
                ctx.ellipse(0, j * planet.size * 0.4, planet.size * 0.7, planet.size * 0.13, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
              }
            }
            break;
          case 4: // Jupiter: brown stripes
            {
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = planet.color;
              ctx.shadowColor = planet.color;
              ctx.shadowBlur = 18;
              ctx.fill();
              ctx.globalAlpha = 0.4;
              for (let j = -2; j <= 2; j++) {
                ctx.beginPath();
                ctx.ellipse(0, j * planet.size * 0.3, planet.size * 0.9, planet.size * 0.18, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#f59e42';
                ctx.fill();
              }
            }
            break;
          case 5: // Saturn: rings
            {
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = planet.color;
              ctx.shadowColor = planet.color;
              ctx.shadowBlur = 14;
              ctx.fill();
              // rings
              ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.ellipse(0, 0, planet.size * 1.7, planet.size * 0.5, Math.PI / 6, 0, Math.PI * 2);
              ctx.strokeStyle = '#fde68a';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
            break;
          case 6: // Uranus: blue gradient, subtle glow
            {
              const grad = ctx.createRadialGradient(0, 0, planet.size * 0.2, 0, 0, planet.size);
              grad.addColorStop(0, '#38bdf8');
              grad.addColorStop(1, planet.color);
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 20;
              ctx.fill();
            }
            break;
          case 7: // Neptune: dark blue, subtle stripes
            {
              ctx.beginPath();
              ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
              ctx.fillStyle = planet.color;
              ctx.shadowColor = planet.color;
              ctx.shadowBlur = 12;
              ctx.fill();
              ctx.globalAlpha = 0.2;
              for (let j = -1; j <= 1; j++) {
                ctx.beginPath();
                ctx.ellipse(0, j * planet.size * 0.3, planet.size * 0.8, planet.size * 0.13, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
              }
            }
            break;
          default:
            ctx.beginPath();
            ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
            ctx.fillStyle = planet.color;
            ctx.fill();
        }
        ctx.restore();
      });

      // ...existing code for stars, meteors, asteroids, comets, meteorites...
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
        ctx.globalAlpha = 0.85;
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);
        // Draw irregular rocky shape
        ctx.beginPath();
        let points = 7 + Math.floor(Math.random() * 3);
        for (let j = 0; j < points; j++) {
          let angle = (Math.PI * 2 * j) / points;
          let rad = a.r * (0.7 + Math.random() * 0.5);
          ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
        }
        ctx.closePath();
        ctx.fillStyle = a.color;
        ctx.shadowColor = '#444';
        ctx.shadowBlur = 8;
        ctx.fill();
        // Add rough texture dots
        ctx.globalAlpha = 0.3;
        for (let k = 0; k < 6; k++) {
          ctx.beginPath();
          ctx.arc(
            (Math.random() - 0.5) * a.r,
            (Math.random() - 0.5) * a.r,
            a.r * 0.18,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = '#888';
          ctx.fill();
        }
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
        // Glowing tail effect
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        let tailGrad = ctx.createLinearGradient(0, 0, -c.tail, c.tail * 0.2);
        tailGrad.addColorStop(0, c.color);
        tailGrad.addColorStop(1, 'rgba(96,165,250,0)');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-c.tail, c.tail * 0.2);
        ctx.stroke();
        ctx.restore();
        // Glowing comet head
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        let cometGrad = ctx.createRadialGradient(0, 0, c.r * 0.2, 0, 0, c.r);
        cometGrad.addColorStop(0, '#fff');
        cometGrad.addColorStop(0.5, c.color);
        cometGrad.addColorStop(1, 'rgba(96,165,250,0.7)');
        ctx.fillStyle = cometGrad;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 24;
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
        // Quick glowing streak effect
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        let meteorGrad = ctx.createLinearGradient(0, 0, -m.tail, m.tail * 0.3);
        meteorGrad.addColorStop(0, '#fff');
        meteorGrad.addColorStop(0.5, m.color);
        meteorGrad.addColorStop(1, 'rgba(245,158,66,0)');
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-m.tail, m.tail * 0.3);
        ctx.stroke();
        // Head (small, bright)
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, m.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 18;
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
