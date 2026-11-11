"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import type { IconName } from "../_data/content";
import { ModuleIcon } from "./icons";

export interface Reason {
  id: string;
  tab: string;
  question: string;
  answer: string;
  points: string[];
  icon: IconName;
}

/**
 * The "five reasons" as a tabbed master-detail: a list of reasons on the left (a scrolling row on phones) and
 * the selected one on the right. Arrow keys move between tabs.
 */
export function ReasonTabs({ items }: { items: Reason[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = items[active];

  const move = (to: number) => {
    const next = (to + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(active + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(items.length - 1);
    }
  };

  return (
    <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[270px_minmax(0,1fr)]">
      <div
        role="tablist"
        aria-label="Five reasons"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-sky-50 p-2 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:p-3"
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`reason-tab-${i}`}
              aria-selected={on}
              aria-controls="reason-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                on ? "border-orange-300 bg-white font-semibold text-slate-900 shadow-sm" : "border-transparent text-slate-600 hover:bg-white/70"
              }`}
            >
              <span className="text-[11px] font-bold text-orange-600">{String(i + 1).padStart(2, "0")}</span>
              <span className="whitespace-nowrap lg:whitespace-normal">{it.tab}</span>
            </button>
          );
        })}
      </div>

      <div
        key={item.id}
        role="tabpanel"
        id="reason-panel"
        aria-labelledby={`reason-tab-${active}`}
        tabIndex={0}
        className="animate-in fade-in p-6 duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500 sm:p-8"
      >
        <span className="flex size-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
          <ModuleIcon name={item.icon} className="size-5" />
        </span>
        <h3 className="mt-4 text-xl leading-snug font-extrabold tracking-tight text-slate-900 sm:text-2xl">{item.question}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{item.answer}</p>
        <ul className="mt-5 space-y-2.5">
          {item.points.map((p) => (
            <li key={p} className="flex gap-3 rounded-xl border border-slate-200 bg-sky-50/60 p-3.5 text-sm text-slate-700">
              <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
