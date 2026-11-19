"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Package } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * "One part, two ways to run it" for /why-synax: the same part travels through five stations in two lanes. In the
 * "Typical alternatives" lane it stalls at a separate MES, at manual paperwork and at re-keying into Tally (the
 * wording is the comparison table's own, `_data/benchmark.ts`). In the Synax lane it flows end to end, the three
 * pillars light up (`LIVE_PILLARS` kickers), a "Synax AI proposes" card is approved at inspection, and the lane
 * finishes first. It is an illustration and says so; the speeds are for effect and no figures are claimed.
 * Drawn on a fixed 680 x 410 stage scaled to fit. Reduced motion: the finished state is shown and nothing moves.
 * Below 640 px a plain two-card comparison replaces the stage (it would be too small to read).
 */

const W = 680;
const H = 410;
const X = [0.14, 0.31, 0.49, 0.67, 0.85].map((f) => f * W);
const Y1 = 150;
const Y2 = 318;
const CYCLE = 13.5;

/** Message ids under "WhyRace.stations". */
const STATIONS = ["s1", "s2", "s3", "s4", "s5"] as const;

// [time in seconds, x] waypoints for the part in each lane.
const TYPICAL: [number, number][] = [[0, X[0]], [1.2, X[1]], [2.7, X[1]], [3.9, X[2]], [5.4, X[2]], [6.6, X[3]], [7.2, X[3]], [8.4, X[4]], [9.9, X[4]]];
const SYNAX: [number, number][] = [[0, X[0]], [1.2, X[1]], [2.4, X[2]], [4.2, X[2]], [5.4, X[3]], [6.6, X[4]]];

function at(points: [number, number][], t: number) {
  if (t <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (t <= points[i][0]) {
      const [t0, x0] = points[i - 1];
      const [t1, x1] = points[i];
      return x0 + ((x1 - x0) * (t - t0)) / (t1 - t0);
    }
  }
  return points[points.length - 1][1];
}

export function WhyRace() {
  const tr = useTranslations("WhyRace");
  const bm = useTranslations("Benchmark");
  const live = useTranslations("Live");
  const [t, setT] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLDivElement | null>(null);

  // The wording is the comparison table's own (messages "Benchmark") and the three pillar names ("Live.pillars").
  const stalls = [bm("cpu.legacy"), bm("filecheck.legacy"), bm("receipt.point")];
  const pillars = (['p1', 'p2', 'p3'] as const).map((p) => live(`pillars.${p}.kicker`));
  const tally = bm("receipt.synax");

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1.5, el.clientWidth / W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Only run while the band is on screen.
  useEffect(() => {
    const el = frame.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    const started = performance.now();
    const id = window.setInterval(() => setT(((performance.now() - started) / 1000) % CYCLE), 50);
    return () => window.clearInterval(id);
  }, [reduced, visible]);

  // Reduced motion shows the finished picture (Synax done, the other lane still waiting at the last stall).
  const time = reduced ? 9 : t;
  const xTypical = at(TYPICAL, time);
  const xSynax = at(SYNAX, time);
  const doneSynax = time > 6.7;
  const waiting = reduced ? true : time > 6.7 && time < 9.9;

  const chip = (text: string, x: number, top: number, on: boolean) => (
    <span
      key={text}
      className={`absolute -translate-x-1/2 rounded-full border border-dashed border-orange-300 bg-orange-50 px-2.5 py-[3px] text-[10.5px] whitespace-nowrap text-accent-strong transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
      style={{ left: x, top }}
    >
      {text}
    </span>
  );
  const badge = (text: string, x: number, on: boolean) => (
    <span
      key={text}
      className={`absolute -translate-x-1/2 rounded-full bg-brand-solid px-2.5 py-[3px] text-[10.5px] whitespace-nowrap text-white transition-all duration-500 ${on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`}
      style={{ left: x, top: 338 }}
    >
      {text}
    </span>
  );

  return (
    <div>
      {/* Phones: a plain comparison */}
      <div className="grid gap-4 sm:hidden">
        <div className="rounded-2xl border border-slate-200 bg-surface p-4">
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{tr("typical")}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            {stalls.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-orange-500" aria-hidden="true">
                  •
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-line/30 bg-sky-50 p-4">
          <p className="text-xs font-bold tracking-wider text-brand uppercase">{tr("synax")}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
            {[...pillars, tally].map((s) => (
              <li key={s} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Larger screens: the animated two-lane stage */}
      <div className="hidden sm:block">
        <p className="sr-only">
          {tr("srDescription", { stalls: stalls.join(", "), pillars: pillars.join(", "), tally })}
        </p>
        <div
          ref={frame}
          aria-hidden="true"
          className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page shadow-sm"
          style={{ height: H * scale }}
        >
          <div className="absolute top-0 left-0 origin-top-left text-[12px] text-slate-900" style={{ width: W, height: H, transform: `scale(${scale})` }}>
            <div className="absolute inset-0 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:28px_28px]" />
            <p className="absolute top-3.5 left-4 text-[10px] tracking-[0.09em] text-slate-500">{tr("title")}</p>
            <p className="absolute top-3.5 right-4 text-[10px] tracking-[0.09em] text-slate-500">{tr("illustration")}</p>

            <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <line x1={X[i]} x2={X[i + 1]} y1={Y1} y2={Y1} style={{ stroke: "var(--scene-race-track)" }} strokeWidth="3" strokeDasharray={i === 0 || i === 2 ? undefined : "4 7"} />
                  <line x1={X[i]} x2={X[i + 1]} y1={Y2} y2={Y2} style={{ stroke: "var(--scene-ring)" }} strokeWidth="3" strokeLinecap="round" />
                </g>
              ))}
            </svg>

            {STATIONS.map((station, i) => (
              <span key={station} className="absolute top-[52px] w-[104px] -translate-x-1/2 text-center text-[11px] leading-tight text-slate-700" style={{ left: X[i] }}>
                {tr(`stations.${station}`)}
              </span>
            ))}
            <p className="absolute top-[104px] left-4 text-[11px] text-slate-500">{tr("typical")}</p>
            <p className="absolute top-[274px] left-4 text-[11px] font-medium text-brand">{tr("synax")}</p>

            {X.map((x, i) => (
              <span key={`a${i}`}>
                <span className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 ${xTypical >= x - 1 ? "border-slate-400 bg-slate-400" : "border-slate-300 bg-surface"}`} style={{ left: x, top: Y1 }} />
                <span className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 ${xSynax >= x - 1 ? "border-brand-line bg-brand-solid" : "border-slate-300 bg-surface"}`} style={{ left: x, top: Y2 }} />
              </span>
            ))}

            {chip(stalls[0], X[1], 172, reduced || (time > 1.4 && time < 2.9))}
            {chip(stalls[1], X[2], 198, reduced || (time > 4.1 && time < 5.6))}
            {chip(stalls[2], X[4], 172, reduced || (time > 8.6 && time < 10.4))}

            {badge(pillars[0], X[0], reduced || time > 0.2)}
            {badge(pillars[1], X[1], reduced || time > 1.2)}
            {badge(pillars[2], X[2], reduced || time > 2.5)}
            {badge(tr("tallyBadge"), X[4] - 8, reduced || time > 6.5)}

            {/* AI approval at inspection */}
            <div
              className={`absolute w-[176px] -translate-x-1/2 rounded-[10px] border border-t-[3px] border-slate-300 border-t-orange-300 bg-surface px-2.5 py-2 text-[11px] transition-opacity duration-500 ${!reduced && time > 2.5 && time < 4.3 ? "opacity-100" : "opacity-0"}`}
              style={{ left: X[2], top: 206 }}
            >
              <p className="text-[10px] tracking-[0.09em] text-slate-500">{tr("aiTitle")}</p>
              <p className="mt-0.5 leading-snug">{tr("aiText")}</p>
              <span className={`mt-1 inline-block rounded-md px-2.5 py-px font-medium transition-colors duration-300 ${time > 3.6 ? "bg-brand-solid text-white" : "bg-orange-300 text-blue-950"}`}>
                {time > 3.6 ? tr("approved") : tr("approve")}
              </span>
            </div>

            {/* The part in each lane */}
            <span className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-400 text-white" style={{ left: xTypical, top: Y1 }}>
              <Package className="size-3" />
            </span>
            <span className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-solid text-white shadow-[0_0_0_5px_rgba(30,58,138,0.15)]" style={{ left: xSynax, top: Y2 }}>
              <Package className="size-3" />
            </span>

            <span className={`absolute right-4 rounded-full bg-brand-solid px-2.5 py-[3px] text-[11px] text-white transition-opacity duration-500 ${doneSynax ? "opacity-100" : "opacity-0"}`} style={{ top: Y2 - 34 }}>
              {tr("done")}
            </span>
            <span className={`absolute right-4 text-[11px] text-slate-400 ${waiting ? "block" : "hidden"}`} style={{ top: Y1 - 34 }}>
              {tr("waiting")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
