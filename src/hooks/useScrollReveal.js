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
    const element = ref.current;
    if (!element) return;

    if (prefersReduced) {
      element.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('revealed');
        } else {
          element.classList.remove('revealed');
        }
      },
      { threshold: options.threshold ?? 0.18, rootMargin: options.rootMargin ?? '0px' }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      element.classList.remove('revealed');
    };
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

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observers = [];
    const pendingTimers = new Map();

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
            pendingTimers.set(i, timer);
          } else {
            clearTimeout(pendingTimers.get(i));
            pendingTimers.delete(i);
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
      pendingTimers.forEach((timer) => clearTimeout(timer));
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
