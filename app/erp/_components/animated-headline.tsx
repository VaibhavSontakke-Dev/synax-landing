"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const PREFIX = "Industry-Focused ERP for";

/** Capability first, then the industries it serves. */
const PHRASES = [
  "Precision",
  "Performance & Control",
  "IT Services",
  "Precision Manufacturing",
];

const INTERVAL_MS = 3200;

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Read via useSyncExternalStore rather than an effect, so the value is correct
 * on the first client render and tracks the setting changing mid-session.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

const HEADLINE_CLASS =
  "text-[length:var(--erp-h1)] leading-[1.1] font-medium tracking-normal text-white";

const GRADIENT_CLASS =
  "bg-gradient-to-r from-erp-sky to-erp-accent bg-clip-text text-transparent";

/** Falls back to the literal curve if the theme token is ever unavailable. */
const TIMING = "0.55s var(--ease-erp, cubic-bezier(0.22, 0.61, 0.36, 1))";

/**
 * Hero headline whose tail rotates through four messages.
 *
 * Layout stability: all four phrases occupy the same CSS grid cell, so the
 * block is permanently as tall as the longest one and nothing below it moves
 * when the text changes.
 *
 * Accessibility: the rotation is decorative. Assistive tech gets one stable
 * sentence from the visually-hidden span, and the animated markup is
 * aria-hidden, so the heading's accessible name never changes mid-read.
 */
export function AnimatedHeadline() {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % PHRASES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Rotation is strictly sequential, so the outgoing phrase is always index-1.
  const previous = (index - 1 + PHRASES.length) % PHRASES.length;

  if (reducedMotion) {
    return (
      <h1 className={HEADLINE_CLASS}>
        <span className="block text-balance">{PREFIX}</span>
        <span className={`block ${GRADIENT_CLASS}`}>
          Precision, Performance &amp; Control
        </span>
      </h1>
    );
  }

  return (
    <h1 className={HEADLINE_CLASS}>
      <span className="sr-only">
        {PREFIX} Precision, Performance and Control — for IT Services and
        Precision Manufacturing.
      </span>

      <span aria-hidden="true">
        <span className="block text-balance">{PREFIX}</span>

        <span className="grid">
          {PHRASES.map((phrase, position) => {
            const isActive = position === index;
            const isLeaving = position === previous;

            return (
              <span
                key={phrase}
                className={`col-start-1 row-start-1 ${GRADIENT_CLASS}`}
                /* Visibility is carried inline rather than in a stylesheet
                   rule: if that rule ever fails to load, every phrase would
                   paint at once on top of the others. Inline styles ship with
                   the markup, so only one phrase can ever be visible.
                   `visibility` is in the transition so the outgoing phrase
                   stays painted while it fades, then stops being selectable. */
                style={{
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? "visible" : "hidden",
                  transform: isActive
                    ? "none"
                    : `translate3d(0, ${isLeaving ? "-0.4em" : "0.4em"}, 0)`,
                  transition: `opacity ${TIMING}, transform ${TIMING}, visibility ${TIMING}`,
                }}
              >
                {phrase}
              </span>
            );
          })}
        </span>
      </span>
    </h1>
  );
}
