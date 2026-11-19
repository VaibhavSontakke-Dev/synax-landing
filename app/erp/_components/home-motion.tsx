"use client";

import { useEffect } from "react";

/**
 * The scroll motion of the home page, in one small component (renders nothing). The look is in globals.css
 * ("Home page motion"); this file only does the two jobs that need JavaScript.
 *
 * 1. Reveal: every `[data-anim]` element, and every direct child of a `[data-anim-stagger]` element, gets `data-in="true"`
 *    the first time it scrolls into view, which starts its entrance animation. Each element is observed once.
 * 2. Parallax: every `[data-parallax="0.12"]` layer is moved by `--py` (pixels, 12% of how far its centre is from the
 *    middle of the screen) while it is on screen. Skipped when the visitor prefers reduced motion.
 *
 * Without IntersectionObserver everything is shown at once, and with reduced motion the CSS keeps everything visible.
 * Content that appears after the first paint (client-only parts) is picked up by two later scans.
 */
const REVEAL = "[data-anim]:not([data-in]), [data-anim-stagger] > :not([data-in])";

export function HomeMotion() {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute("data-in", "true");
    const seen = new WeakSet<Element>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Reveal --------------------------------------------------------------------------------------------
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
      );
    }
    const scan = () => {
      document.querySelectorAll(REVEAL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (io) io.observe(el);
        else show(el);
      });
    };
    scan();
    const later = [window.setTimeout(scan, 400), window.setTimeout(scan, 1800)];

    // ---- Parallax ------------------------------------------------------------------------------------------
    const layers = reduced ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const onScreen = new Set<HTMLElement>();
    let layerObserver: IntersectionObserver | null = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      onScreen.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const factor = Number(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * factor;
        // Clamp so a tall layer can never drift far from where it was designed to sit.
        el.style.setProperty("--py", `${Math.max(-80, Math.min(80, offset)).toFixed(1)}px`);
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (layers.length && typeof IntersectionObserver !== "undefined") {
      layerObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) onScreen.add(entry.target as HTMLElement);
            else onScreen.delete(entry.target as HTMLElement);
          }
          request();
        },
        { rootMargin: "20% 0px 20% 0px" },
      );
      layers.forEach((el) => layerObserver?.observe(el));
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
    }

    return () => {
      io?.disconnect();
      layerObserver?.disconnect();
      later.forEach(window.clearTimeout);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return null;
}
