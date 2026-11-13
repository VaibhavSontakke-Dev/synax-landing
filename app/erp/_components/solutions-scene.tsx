"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Check, Factory, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Animated hero scene for /solutions: a ring of the eight module areas around a hub. For each solution in turn
 * (Precision, Aerospace, HRMS, Staffing) the "what hurts" note appears, the start modules tick off in order, the
 * "then add" modules slide in, and the areas switch on around the ring (solid = core, dashed = optional, faded = not
 * usually part of it) while the reach ring fills to the core count. All words and the coverage come from
 * `_data/solution-paths.ts` and `_data/solutions.ts` (passed in by the page). Drawn on a fixed 640 x 440 stage that
 * is scaled to fit. With reduced motion it shows each solution fully switched on and does not auto-advance; hovering
 * pauses the cycle. The stage is decorative (aria-hidden); the solution buttons and the link are real controls.
 */

const W = 640;
const H = 440;
const CX = 380;
const CY = 212;
const RX = 140;
const RY = 100;
const CYCLE_MS = 9500;
const STEP_MS = 900;

export interface SceneSolution {
  key: string;
  title: string;
  pain: string;
  start: string[];
  then: string[];
  /** Area name -> 0 (not usually), 1 (optional), 2 (core). */
  coverage: Record<string, number>;
}

const ICON: Record<string, LucideIcon> = { precision: Factory, aerospace: ShieldCheck, hrms: Building2, staffing: Users };
const SHORT: Record<string, string> = { precision: "Precision", aerospace: "Aerospace", hrms: "HRMS", staffing: "Staffing" };
const AREA_SHORT: Record<string, string> = { "Procurement & Stores": "Stores", Collaboration: "Collab." };

export function SolutionsScene({ areas, solutions }: { areas: string[]; solutions: SceneSolution[] }) {
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1.15, el.clientWidth / W));
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

  // One clock per solution; advance when the cycle is over.
  useEffect(() => {
    if (reduced || paused) return;
    const started = performance.now() - elapsed;
    const id = window.setInterval(() => {
      const t = performance.now() - started;
      if (t >= CYCLE_MS) {
        setIdx((i) => (i + 1) % solutions.length);
        setElapsed(0);
      } else {
        setElapsed(t);
      }
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, paused, idx, solutions.length]);

  const choose = (i: number) => {
    setIdx(i);
    setElapsed(0);
  };

  const s = solutions[idx];
  const t = reduced ? 1e9 : elapsed;
  const Hub = ICON[s.key] ?? Factory;

  const nodes = areas.map((area, i) => {
    const ang = ((-90 + i * 45) * Math.PI) / 180;
    return { area, x: CX + RX * Math.cos(ang), y: CY + RY * Math.sin(ang), level: s.coverage[area] ?? 0 };
  });
  // Light core areas first, then optional ones, 380 ms apart.
  const order = [...nodes.filter((n) => n.level === 2), ...nodes.filter((n) => n.level === 1)].map((n) => n.area);
  const lightAt = (area: string) => 700 + order.indexOf(area) * 380;
  const core = nodes.filter((n) => n.level === 2).length;
  const opt = nodes.filter((n) => n.level === 1).length;
  const rest = areas.length - core - opt;
  const reachAt = 700 + order.length * 380 + 200;
  const reachOn = t >= reachAt;
  const thenStart = 900 + s.start.length * STEP_MS;

  const ringLen = 2 * Math.PI * 26;
  const orbit = `M ${CX - RX * 1.35} ${CY} a ${RX * 1.35} ${RY * 1.3} 0 1 0 ${RX * 2.7} 0 a ${RX * 1.35} ${RY * 1.3} 0 1 0 ${-RX * 2.7} 0`;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <p className="sr-only">
        Animated overview: for each solution, the modules to switch on first, what to add next, and how many of the eight module areas are core to it. The
        same information is in the sections below.
      </p>
      <div
        ref={frame}
        className="relative w-full overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white shadow-sm"
        style={{ height: H * scale }}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <div aria-hidden="true" className="absolute inset-0 text-[12px] text-slate-900">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(30,58,138,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

            <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="rgba(255,255,255,0.5)" stroke="#93b4e6" strokeWidth="1.5" strokeDasharray="5 5" />
              <ellipse cx={CX} cy={CY} rx={RX * 1.35} ry={RY * 1.3} fill="none" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="2 6" />
              {nodes.map((n) => (
                <line key={n.area} x1={CX} y1={CY} x2={n.x} y2={n.y} stroke="#bfdbfe" strokeWidth="1" strokeDasharray="3 4" />
              ))}
              {reduced ? null : (
                <circle r="5" fill="#fdba74" stroke="#fff" strokeWidth="2">
                  <animateMotion dur="8s" repeatCount="indefinite" path={orbit} />
                </circle>
              )}
            </svg>

            {/* What hurts, start with, then add */}
            <div className="absolute top-3.5 left-3.5 w-[176px] rounded-xl border border-slate-300 bg-white/90 px-3 py-2.5">
              <p className="text-[10px] tracking-[0.09em] text-slate-500">WHAT HURTS</p>
              <p className="mt-1 min-h-[48px] text-[12px] leading-snug">{s.pain}</p>
            </div>
            <div className="absolute top-[132px] left-3.5 w-[176px] rounded-xl border border-slate-300 bg-white/90 px-3 py-2.5">
              <p className="text-[10px] tracking-[0.09em] text-slate-500">START WITH</p>
              <ol className="mt-1">
                {s.start.map((m, n) => {
                  const on = t >= 900 + n * STEP_MS;
                  return (
                    <li key={m} className={`flex items-center gap-2 py-[3px] text-[11px] leading-tight transition-colors duration-500 ${on ? "text-slate-900" : "text-slate-400"}`}>
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[9px] transition-all duration-500 ${
                          on ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300 text-transparent"
                        }`}
                      >
                        {n + 1}
                      </span>
                      {m}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-2 text-[10px] tracking-[0.09em] text-slate-500">THEN ADD</p>
              <div className="min-h-[34px]">
                {s.then.map((m, n) => (
                  <span
                    key={m}
                    className={`mt-[3px] mr-1 inline-block rounded-md border border-dashed border-sky-300 bg-sky-50 px-1.5 py-px text-[10.5px] transition-all duration-500 ${
                      t >= thenStart + n * 450 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    }`}
                  >
                    + {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Reach */}
            <div className="absolute top-3.5 right-3.5 w-[128px] rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-center">
              <p className="text-[10px] tracking-[0.09em] text-slate-500">REACH</p>
              <svg width="56" height="56" viewBox="0 0 64 64" className="mx-auto mt-0.5 block">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#dbeafe" strokeWidth="7" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={ringLen}
                  strokeDashoffset={reachOn ? ringLen * (1 - core / areas.length) : ringLen}
                  transform="rotate(-90 32 32)"
                  style={{ transition: "stroke-dashoffset 1.2s" }}
                />
              </svg>
              <p className="text-[15px] font-medium text-blue-900">{reachOn ? core : 0} of {areas.length}</p>
              <p className="text-[10px] text-slate-500">areas core</p>
            </div>

            {/* Switch-on order */}
            <div className="absolute right-3.5 bottom-[50px] w-[128px] rounded-xl border border-slate-300 bg-white/90 px-3 py-2">
              <p className="text-[10px] tracking-[0.09em] text-slate-500">SWITCH-ON ORDER</p>
              <div className="mt-1.5 space-y-[5px]">
                {[
                  { n: core, c: "bg-blue-900" },
                  { n: opt, c: "bg-blue-900/40" },
                  { n: rest, c: "bg-orange-300" },
                ].map((b, i) => (
                  <div key={i} className="h-1.5 overflow-hidden rounded-full bg-sky-100">
                    <div className={`h-1.5 rounded-full ${b.c}`} style={{ width: reachOn ? `${(b.n / areas.length) * 100}%` : "0%", transition: "width 1.2s" }} />
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-slate-500">core · optional · later</p>
            </div>

            {/* Area nodes */}
            {nodes.map((n) => {
              const lit = t >= lightAt(n.area) && n.level > 0;
              const kind = !lit ? "off" : n.level === 2 ? "core" : "opt";
              return (
                <span
                  key={n.area}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border-[1.5px] px-2.5 py-1 text-[11px] whitespace-nowrap transition-all duration-500 ${
                    kind === "core"
                      ? "border-blue-900 bg-white text-blue-900 opacity-100 shadow-md"
                      : kind === "opt"
                        ? "border-dashed border-blue-900 bg-white/90 text-blue-900 opacity-100"
                        : "border-slate-300 bg-white text-slate-400 opacity-60"
                  }`}
                  style={{ left: n.x, top: n.y }}
                >
                  <span
                    className={`flex size-3.5 items-center justify-center rounded-full text-[9px] transition-all duration-500 ${
                      kind === "core" ? "bg-blue-900 text-white" : kind === "opt" ? "border-[1.5px] border-dashed border-blue-900" : "bg-slate-200"
                    }`}
                  >
                    {kind === "core" ? <Check className="size-2.5" /> : null}
                  </span>
                  {AREA_SHORT[n.area] ?? n.area}
                </span>
              );
            })}

            {/* Hub */}
            <div
              className="absolute flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-blue-900 text-center text-white shadow-[0_0_0_10px_rgba(30,58,138,0.1),0_10px_24px_rgba(30,58,138,0.3)]"
              style={{ left: CX, top: CY }}
            >
              <Hub className="size-6" />
              <span className="mt-0.5 text-[11px]">{SHORT[s.key] ?? s.title}</span>
            </div>
          </div>

          {/* Solution buttons (real controls, so they are outside the aria-hidden stage) */}
          <div className="absolute inset-x-0 bottom-3.5 flex flex-wrap justify-center gap-1.5">
            {solutions.map((x, i) => (
              <button
                key={x.key}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={i === idx}
                className={`cursor-pointer rounded-full border px-2.5 py-[3px] text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  i === idx ? "border-blue-900 bg-blue-900 text-white" : "border-blue-900/30 bg-white/80 text-slate-600 hover:border-blue-900"
                }`}
              >
                {SHORT[x.key] ?? x.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <a
        href={`#start-${s.key}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        See the full path for {s.title}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
