"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CircleCheck,
  Clock,
  Cpu,
  FileCheck,
  MoveRight,
  Receipt,
  Scale,
  Sparkles,
} from "lucide-react";
import { SectionTag } from "./section-tag";
import { BENCHMARK, type BenchmarkIcon } from "../_data/benchmark";

/**
 * "Market Benchmark" — why industry leaders migrate to Synax.
 *
 * A bento layout: one timeline card that draws the implementation-time claim as three bars (they grow
 * in when scrolled into view), then one card per remaining dimension with the Synax advantage first
 * and the two alternatives beneath, and a navy call-to-action card in the sixth slot. Every string is
 * the original section's; the leading "✓" glyphs became icons.
 *
 * NOTE: the alternatives describe typical setups, not named products. Synax's own rollout line follows the live
 * portal ("module by module within a few weeks"); the bar lengths are illustrative, not measurements.
 */

const LEGACY = "Legacy ERP suites";
const POINT = "Disconnected Point Tools";

const BENCHMARK_ICONS: Record<BenchmarkIcon, LucideIcon> = {
  cpu: Cpu,
  filecheck: FileCheck,
  clock: Clock,
  sparkles: Sparkles,
  receipt: Receipt,
};

// Rows live in _data/benchmark.ts (shared with the /why-synax page).
const DIMENSIONS = BENCHMARK.map((d) => ({ ...d, Icon: BENCHMARK_ICONS[d.icon] }));

/** Bar lengths are illustrative (a share of the track), not measurements. */
const TIMELINE = [
  { name: "Synax Unified Suite", value: "Live module by module in a few weeks", width: "12%", kind: "synax" },
  { name: LEGACY, value: "A long, consultant-led project", width: "64%", kind: "legacy" },
  { name: POINT, value: "Endless patchworks & API breaks", width: "46%", kind: "point" },
] as const;

export function Comparison({ onSeeProducts }: { onSeeProducts: () => void }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Grow the bars once the timeline card is on screen.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="comparison"
      aria-labelledby="comparison-heading"
      className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Header */}
      <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
        <SectionTag>Market Benchmark</SectionTag>
        <h2
          id="comparison-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
        >
          Why Industry Leaders Migrate to Synax
        </h2>
        <p className="text-xs text-slate-600 sm:text-sm md:text-base">
          Compare modern purpose-built manufacturing software against legacy monoliths and disjointed point
          solutions.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-blue-900">
            <Calendar className="size-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Implementation Timeline</h3>
            <p className="text-xs text-slate-400">Illustrative scale, based on typical deployments</p>
          </div>
        </div>

        <ul className="mt-5 space-y-4">
          {TIMELINE.map((row) => (
            <li key={row.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm">
                <span className={row.kind === "synax" ? "font-semibold text-slate-900" : "text-slate-500"}>
                  {row.name}
                </span>
                <span className={row.kind === "synax" ? "font-semibold text-slate-900" : "text-slate-500"}>
                  {row.value}
                </span>
              </div>
              <div className="relative mt-1.5 h-3.5 rounded-full bg-slate-100" aria-hidden="true">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none ${
                    row.kind === "synax"
                      ? "bg-blue-900"
                      : row.kind === "legacy"
                        ? "bg-slate-300"
                        : "bg-[repeating-linear-gradient(90deg,#cbd5e1_0_8px,transparent_8px_14px)]"
                  }`}
                  style={{ width: shown ? row.width : "0%" }}
                />
                {row.kind === "point" && (
                  <MoveRight
                    className={`absolute top-1/2 size-5 -translate-y-1/2 text-slate-400 transition-[left] duration-1000 ease-out motion-reduce:transition-none`}
                    style={{ left: shown ? `calc(${row.width} + 0.25rem)` : "0.25rem" }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Dimension cards + CTA */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((d) => (
          <article key={d.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-3 text-sm font-bold text-slate-900">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-blue-900">
                <d.Icon className="size-[18px]" aria-hidden="true" />
              </span>
              {d.title}
            </h3>

            <p className="flex items-start gap-2 rounded-xl border-2 border-blue-900 bg-blue-900/[0.05] px-3 py-2.5 text-sm font-semibold text-slate-900">
              <CircleCheck className="mt-0.5 size-[18px] shrink-0 text-orange-500" aria-hidden="true" />
              <span>
                <span className="sr-only">Synax: </span>
                {d.synax}
              </span>
            </p>

            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-[11px] font-semibold text-slate-400">{LEGACY}</dt>
                <dd className="mt-0.5 leading-snug text-slate-500">{d.legacy}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold text-slate-400">{POINT}</dt>
                <dd className="mt-0.5 leading-snug text-slate-500">{d.point}</dd>
              </div>
            </dl>
          </article>
        ))}

        <div className="flex flex-col justify-between gap-5 rounded-2xl bg-blue-900 p-5 text-white shadow-sm">
          <div>
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-orange-300">
              <Scale className="size-[18px]" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-lg leading-snug font-extrabold">See how Synax compares on your own process</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              Bring your current tools and workflows to a 30-minute walkthrough.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onSeeProducts}
              className="cursor-pointer rounded-lg border-2 border-orange-400 bg-transparent px-4 py-[10px] text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Explore the products
            </button>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        Comparison reflects typical deployments and Synax&apos;s own assessment; results vary with scope and data
        readiness.
      </p>
    </section>
  );
}
