import { useEffect, useRef } from "react";

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

    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.transition = "none";
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

    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.opacity = "1";
        child.style.transform = "none";
        child.style.transition = "none";
      }
    });
  }, []);

  return ref;
}