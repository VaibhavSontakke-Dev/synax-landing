"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, ArrowDown, ArrowRight, Building2, Check, Factory, Plane, Users } from "lucide-react";
import { SectionTag } from "./section-tag";
import { hrefFor, routeFor } from "../_data/products";
import { SOLUTIONS, type SolutionKey } from "../_data/solutions";

/**
 * "Sector & Challenge Alignment" — solutions by industry / business need.
 *
 * Master-detail instead of four stacked, filterable cards: a grouped sector list (By industry /
 * By business need) and one detail panel showing the challenge → how Synax solves it, the key
 * capabilities and two actions. Copy is the original section's; the numeric "Measurable ROI" chips
 * (e.g. "10x faster FAIR release", "99.9% punch accuracy", "+28% bench profitability") were
 * dropped because they cannot be substantiated — add a results strip back only with real data.
 * The selected sector now lives here instead of in HomeView (which re-rendered the whole page).
 */

const ICONS: Record<SolutionKey, LucideIcon> = {
  precision: Factory,
  aerospace: Plane,
  hrms: Building2,
  staffing: Users,
};

/** Same colours the Products menu uses for each product. */
const TILES: Record<SolutionKey, string> = {
  precision: "bg-emerald-50 text-emerald-600",
  aerospace: "bg-slate-100 text-blue-900",
  hrms: "bg-slate-100 text-blue-900",
  staffing: "bg-orange-50 text-orange-700",
};

// Copy lives in _data/solutions.ts (shared with the /solutions page).
const SECTORS = SOLUTIONS.map((s) => ({ ...s, Icon: ICONS[s.key], tile: TILES[s.key], page: s.key }));

export function Sectors() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sector = SECTORS[active];

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = SECTORS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      select(next, true);
    }
  };

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="mx-auto max-w-7xl scroll-mt-20 border-t border-slate-200/80 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center">
        <SectionTag>Sector & Challenge Alignment</SectionTag>
        <h2 id="solutions-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Solutions by Industry / Business Need
        </h2>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm md:text-base">
          Discover how the Synax product ecosystem directly addresses mission-critical operational challenges,
          compliance bottlenecks, and workforce friction across specialized sectors.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        {/* Sector list: horizontal scroller on small screens, grouped list from lg */}
        <div
          role="tablist"
          aria-label="Sectors"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {SECTORS.map((s, i) => {
            const on = i === active;
            const showGroup = i === 0 || SECTORS[i - 1].group !== s.group;
            return (
              <div key={s.title} className="contents">
                {showGroup && (
                  <p
                    className={`hidden px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-slate-400 uppercase lg:block ${
                      i === 0 ? "pt-0" : "pt-4"
                    }`}
                  >
                    {s.group}
                  </p>
                )}
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`sector-tab-${i}`}
                  aria-selected={on}
                  aria-controls="sector-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className={`flex min-w-[15rem] shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-l-[3px] px-2.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 lg:min-w-0 lg:shrink ${
                    on
                      ? "border-slate-200 border-l-orange-400 bg-white text-slate-900 shadow-sm"
                      : "border-transparent text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${s.tile}`}>
                    <s.Icon className="size-[17px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-tight font-semibold">{s.title}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">{s.short}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          id="sector-panel"
          role="tabpanel"
          aria-labelledby={`sector-tab-${active}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${sector.tile}`}>{sector.tag}</span>
            <span className="text-xs text-slate-500">
              Powered by <strong className="font-semibold text-slate-900">{routeFor(sector.key).name}</strong>
            </span>
          </div>

          <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{sector.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{sector.description}</p>

          {/* Challenge → solution */}
          <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <span className="flex size-5 items-center justify-center rounded-md bg-orange-50 text-orange-700">
                  <AlertCircle className="size-3.5" aria-hidden="true" />
                </span>
                The Business Challenge
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">{sector.challenge}</p>
            </div>

            <div className="flex items-center justify-center text-orange-400" aria-hidden="true">
              <ArrowRight className="hidden size-5 md:block" />
              <ArrowDown className="size-5 md:hidden" />
            </div>

            <div className="rounded-xl border-2 border-blue-900 bg-white p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <span className="flex size-5 items-center justify-center rounded-md bg-blue-900 text-white">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                How Synax Solves It
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">{sector.solution}</p>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Key capabilities</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {sector.capabilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Link
              href={hrefFor(sector.page)}
              className="flex items-center gap-1.5 rounded-lg border-2 border-orange-500 bg-transparent px-4 py-[10px] text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <span>Explore this solution</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
        Your sector is not listed?
        <Link
          href="/solutions"
          className="inline-flex items-center gap-1 rounded-sm border-b-2 border-orange-400 font-semibold text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          See every solution in detail
          <ArrowRight className="size-3.5 text-orange-500" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
