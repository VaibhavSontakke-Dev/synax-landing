"use client";

import { useEffect, useState } from "react";

/**
 * Desktop "On this page" list for /privacy and /terms: sticky beside the text, the section being read is
 * highlighted, and a thin bar shows how far through the document you are.
 */
export function LegalToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      const doc = document.getElementById("legal-text");
      if (doc) {
        const box = doc.getBoundingClientRect();
        const span = box.height - window.innerHeight * 0.6;
        setProgress(Math.min(1, Math.max(0, (140 - box.top) / Math.max(1, span))));
        if (box.bottom <= window.innerHeight) current = items[items.length - 1]?.id ?? current;
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

  return (
    <nav aria-label="On this page" className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm">
      <p className="px-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">On this page</p>
      <div className="mx-2 mt-3 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className="h-full rounded-full bg-orange-500 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>
      <ol className="mt-3 max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-1">
        {items.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                aria-current={on ? "location" : undefined}
                className={`flex gap-2.5 rounded-lg border-l-2 px-2 py-1.5 text-[13px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  on ? "border-orange-500 bg-sky-50 font-semibold text-brand" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={`w-5 shrink-0 text-right tabular-nums ${on ? "text-accent" : "text-slate-400"}`}>{i + 1}.</span>
                {s.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
