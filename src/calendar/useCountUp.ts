import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `target` as the number scrolls into view. The real value shows at rest
 * (thumbnails, reduced motion, no IntersectionObserver); the count starts just before
 * the element becomes visible so the jump to zero is never seen.
 */
export function useCountUp<T extends HTMLElement>(target: number, duration = 1100) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(target);
  useEffect(() => {
    const el = ref.current;
    setValue(target);
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setValue(0);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { rootMargin: '0px 0px 120px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [ref, value] as const;
}
