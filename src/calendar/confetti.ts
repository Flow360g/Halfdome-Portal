/*
 * A small burst of brand domes from a point on screen: Sequoia, Camas and White Fir
 * half-rings that pop up and tumble down. Skipped for reduced motion.
 */
const COLOURS = ['#8e1c02', '#b0a3d0', '#d2c663'];

export function domeBurst(x: number, y: number, count = 22) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '200',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const parts = Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 5 + Math.random() * 7;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      colour: COLOURS[i % COLOURS.length],
    };
  });

  const t0 = performance.now();
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const fade = Math.max(0, 1 - Math.max(0, t - 0.7) / 0.6);
    for (const p of parts) {
      p.vy += 0.32;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.arc(0, 0, p.r, Math.PI, 0);
      ctx.arc(0, 0, p.r * 0.45, 0, Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = p.colour;
      ctx.fill();
      ctx.restore();
    }
    if (t < 1.4) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

export function burstFrom(el: Element | null) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  domeBurst(r.left + r.width / 2, r.top + r.height / 2);
}
