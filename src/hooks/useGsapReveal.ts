import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Shared defaults for a consistent, premium feel
const DEFAULTS = {
  duration: 1,
  ease: "power3.out",
  start: "top 88%",
};

type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
};

/**
 * Reveal a single element on scroll.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { y = 60, x = 0, scale, duration = DEFAULTS.duration, delay = 0, ease = DEFAULTS.ease, start = DEFAULTS.start } = options;

    const fromVars: gsap.TweenVars = { opacity: 0, y, x };
    if (scale !== undefined) fromVars.scale = scale;

    gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
}

/**
 * Stagger-reveal children of a container on scroll.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  childSelector: string,
  options: RevealOptions & { stagger?: number } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    const { y = 50, x = 0, scale, duration = 0.8, stagger = 0.1, ease = DEFAULTS.ease, start = DEFAULTS.start } = options;

    const fromVars: gsap.TweenVars = { opacity: 0, y, x };
    if (scale !== undefined) fromVars.scale = scale;

    gsap.fromTo(
      children,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: container,
          start,
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  return ref;
}