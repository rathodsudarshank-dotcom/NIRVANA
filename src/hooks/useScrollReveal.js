import { useEffect, useRef, useCallback } from 'react';

/**
 * Reusable scroll-reveal hook.
 * Adds `revealed` class when the element enters the viewport,
 * removes it when the element leaves — so the animation replays
 * every time the user scrolls past and back.
 *
 * Supported CSS classes (apply to the element via className):
 *   reveal        → fade-up
 *   reveal-left   → slide from left
 *   reveal-right  → slide from right
 *   reveal-scale  → scale-in
 *   reveal-fade   → simple fade-in (no translate)
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      el.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
        } else {
          el.classList.remove('revealed');
        }
      },
      { threshold: options.threshold ?? 0.18, rootMargin: options.rootMargin ?? '0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}

/**
 * Staggered scroll-reveal for a list of children.
 * Each child gets a delayed `revealed` class on enter,
 * and all are reset when any child leaves the viewport.
 */
export function useStaggerReveal(count, baseDelay = 100) {
  const refs = useRef([]);
  const timers = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observers = [];

    refs.current.forEach((el, i) => {
      if (!el) return;
      if (prefersReduced) {
        el.classList.add('revealed');
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const timer = setTimeout(() => el.classList.add('revealed'), i * baseDelay);
            timers.current[i] = timer;
          } else {
            clearTimeout(timers.current[i]);
            el.classList.remove('revealed');
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, [count, baseDelay]);

  const setRef = useCallback(
    (index) => (el) => {
      refs.current[index] = el;
    },
    []
  );

  return setRef;
}
