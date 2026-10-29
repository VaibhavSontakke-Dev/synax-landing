"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children once they scroll into view.
 *
 * The hidden state is rendered on the server so there is no flash of visible
 * content that then jumps. Three things can turn the animation off, and each
 * leaves the content readable: `prefers-reduced-motion` (handled entirely in
 * globals.css, so it also tracks changes made while the page is open), a
 * browser without IntersectionObserver, and no JavaScript at all (see the
 * <noscript> rule in the route layout).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  id,
  as = "div",
}: {
  children: React.ReactNode;
  /** Stagger within a group, in ms. Keep groups under ~240ms in total. */
  delay?: number;
  className?: string;
  id?: string;
  /** Use "li" inside a <ul>/<ol> — a wrapping <div> there is invalid markup. */
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer available: reveal on the next frame instead of staying hidden.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    // Anything already on screen at mount resolves on the observer's first call.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const props = {
    id,
    className: `erp-reveal ${className}`,
    "data-visible": visible ? "true" : "false",
    style: delay
      ? ({ "--erp-delay": `${delay}ms` } as React.CSSProperties)
      : undefined,
  };

  if (as === "li") {
    return (
      <li {...props} ref={ref as unknown as React.RefObject<HTMLLIElement>}>
        {children}
      </li>
    );
  }

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
}
