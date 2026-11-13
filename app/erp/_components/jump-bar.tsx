"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky "on this page" chips. The chip for the section you are reading is navy with white text (the
 * first one is active from the top of the page), and clicking a chip activates it straight away. The
 * active section is the last one whose top has passed just under the sticky header + this bar.
 */
export function JumpBar({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const list = useRef<HTMLUListElement | null>(null);
  const chips = useRef<Record<string, HTMLAnchorElement | null>>({});
  const lock = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < lock.current) return;
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      // At the very bottom the last section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = items[items.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the active chip visible when the row scrolls sideways (phones). Only the chip row is scrolled: calling
  // scrollIntoView here also scrolled the PAGE down to the bar on load whenever a tall hero pushed it below the
  // fold (so /why-synax and /security opened past their hero).
  useEffect(() => {
    const row = list.current;
    const chip = chips.current[active];
    if (!row || !chip) return;
    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    const left = chipBox.left - rowBox.left + row.scrollLeft - (row.clientWidth - chipBox.width) / 2;
    row.scrollTo({ left: Math.max(0, left) });
  }, [active]);

  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <ul ref={list} className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        {items.map((j) => {
          const on = j.id === active;
          return (
            <li key={j.id} className="shrink-0">
              <a
                ref={(el) => {
                  chips.current[j.id] = el;
                }}
                href={`#${j.id}`}
                aria-current={on ? "true" : undefined}
                onClick={() => {
                  setActive(j.id);
                  // Let the smooth scroll finish before the scroll listener takes over again.
                  lock.current = performance.now() + 900;
                }}
                className={`block rounded-full border px-3.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  on
                    ? "border-blue-900 bg-blue-900 text-white shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-blue-900"
                }`}
              >
                {j.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
