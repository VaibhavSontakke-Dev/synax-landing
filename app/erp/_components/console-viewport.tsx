"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, CircleCheck, Sparkles } from "lucide-react";
import { hrefFor } from "../_data/products";

/**
 * The viewport of the home page's "Live Platform Preview": a clear photo panel beside a dashboard with
 * four stat tiles, a flow timeline, a "needs attention" list and a "Synax AI proposes" card. The window
 * bar and tabs above it live in landingpage.tsx. All figures are sample data.
 */

export type ConsoleTab = "precision" | "aerospace" | "hrms" | "staffing";

type Row = [label: string, value: string, kind: "w" | "l" | "r"];
type Kpi = { label: string; value: string; note: string; good: boolean; spark: number[] };

interface TabData {
  photo: string;
  chip: string;
  head: string;
  caption: string;
  kicker: string;
  title: string;
  sim: { label: string; kpi: number; value: string };
  kpis: Kpi[];
  flowLabel: string;
  steps: string[];
  active: number;
  rows: Row[];
  ai: { ask: string; done: string };
}

const DATA: Record<ConsoleTab, TabData> = {
  precision: {
    photo: "/images/precision.png",
    chip: "Plant 1 · Machining",
    head: "Machine to invoice",
    caption: "Cycle counts from the machine drive the route card, the COC and the GST invoice.",
    kicker: "Live · CNC machine feed",
    title: "Machine loading, counts and dispatch",
    sim: { label: "Simulate tool swap", kpi: 2, value: "98%" },
    kpis: [
      { label: "Shop OEE", value: "94.8%", note: "+1.2", good: true, spark: [88, 90, 89, 92, 91, 93, 94, 94.8] },
      { label: "Scrap rate", value: "0.08%", note: "-0.02", good: true, spark: [14, 12, 12, 10, 10, 9, 9, 8] },
      { label: "Tool life", value: "86%", note: "Swap soon", good: false, spark: [100, 97, 94, 92, 90, 89, 87, 86] },
      { label: "Job PM-8092", value: "48 / 50", note: "pcs done", good: true, spark: [5, 12, 20, 27, 33, 40, 45, 48] },
    ],
    flowLabel: "Spindle to invoice",
    steps: ["RFQ & PO", "Gate entry", "Route card", "Machine counts", "Inspection & COC", "Invoice"],
    active: 3,
    rows: [
      ["Route cards awaiting buy-off", "2", "w"],
      ["Challans past return date", "2", "l"],
      ["Lots ready to dispatch", "3", "r"],
    ],
    ai: {
      ask: "2 challans are past their return date. Draft reminders to the customer?",
      done: "2 reminders drafted. They wait for your review.",
    },
  },
  aerospace: {
    photo: "/images/aerospace.png",
    chip: "Quality lab · Inspection",
    head: "Release against a complete record",
    caption: "AS9100D QMS controls sit at the checkpoints, so the evidence builds itself.",
    kicker: "AS9100D QMS controls",
    title: "FAIR register and quality gates",
    sim: { label: "Run FAIR check", kpi: 0, value: "Passed" },
    kpis: [
      { label: "FAIR register", value: "Up to date", note: "Forms 1 to 3", good: true, spark: [3, 4, 4, 5, 5, 6, 6, 7] },
      { label: "Certificate of conformance", value: "Ready", note: "linked", good: true, spark: [1, 1, 2, 2, 3, 3, 4, 4] },
      { label: "NCR / CAPA", value: "1 open", note: "review today", good: false, spark: [3, 2, 2, 2, 1, 1, 1, 1] },
      { label: "Calibration", value: "1 due", note: "gauge G-114", good: false, spark: [0, 0, 0, 1, 0, 0, 1, 1] },
    ],
    flowLabel: "Plan, execute, inspect, release",
    steps: ["Plan", "Execute", "Inspect", "Release"],
    active: 2,
    rows: [
      ["FAIR register", "Ready", "r"],
      ["NCR / CAPA", "1 open", "w"],
      ["Calibration due", "1", "l"],
    ],
    ai: {
      ask: "Gauge G-114 calibration is due. Hold the next inspection until it is renewed?",
      done: "Inspection on hold. Calibration task created.",
    },
  },
  hrms: {
    photo: "/images/hrms.jpg",
    chip: "Plant 1 · Shift Alpha",
    head: "From the first day to the payslip",
    caption: "Attendance and approvals feed payroll, in the same workspace as operations.",
    kicker: "Employee lifecycle",
    title: "Attendance, approvals and payroll",
    sim: { label: "Punch simulator", kpi: 0, value: "429" },
    kpis: [
      { label: "Biometric punches", value: "428", note: "on floor", good: true, spark: [300, 340, 380, 400, 410, 420, 425, 428] },
      { label: "Break passes", value: "12", note: "active", good: false, spark: [6, 8, 9, 11, 12, 13, 12, 12] },
      { label: "Payroll", value: "Ready", note: "for approval", good: true, spark: [1, 1, 2, 2, 3, 3, 4, 4] },
      { label: "Leave requests", value: "2", note: "to approve", good: false, spark: [1, 2, 1, 3, 2, 2, 1, 2] },
    ],
    flowLabel: "First day to payslip",
    steps: ["Employee record", "Attendance & leave", "Overtime approval", "Payroll", "Department KPIs"],
    active: 2,
    rows: [
      ["Attendance logs synced", "Done", "r"],
      ["Overtime approvals waiting", "3", "w"],
      ["Leave requests to approve", "2", "w"],
    ],
    ai: {
      ask: "3 overtime requests are waiting. Approve the ones within policy?",
      done: "2 approved, 1 sent back. Logged in the history.",
    },
  },
  staffing: {
    photo: "/images/IT-staffing.jpg",
    chip: "Delivery desk",
    head: "Requirement to deployment",
    caption: "Customer needs, candidates, interviews and deployments in one flow.",
    kicker: "Staffing & resources",
    title: "Pipeline and deployments",
    sim: { label: "Run match", kpi: 0, value: "7" },
    kpis: [
      { label: "Open requirements", value: "6", note: "this week", good: false, spark: [3, 4, 4, 5, 5, 6, 6, 6] },
      { label: "Interviews", value: "9", note: "scheduled", good: true, spark: [2, 3, 5, 5, 6, 7, 8, 9] },
      { label: "Offers out", value: "3", note: "awaiting reply", good: false, spark: [1, 1, 2, 2, 2, 3, 3, 3] },
      { label: "Deployed", value: "24", note: "resources", good: true, spark: [18, 19, 20, 21, 22, 23, 24, 24] },
    ],
    flowLabel: "Requirement to deployment",
    steps: ["Requirement", "Candidates", "Interviews", "Offer & onboarding", "Deployment"],
    active: 2,
    rows: [
      ["Interviews today", "3", "r"],
      ["Timesheets pending", "5", "w"],
      ["Replacement awaiting approval", "1", "w"],
    ],
    ai: {
      ask: "Requirement CR-402 has 3 matching candidates. Shortlist them for interview?",
      done: "3 candidates shortlisted. Interviews proposed.",
    },
  },
};

const PAGE_KEY = { precision: "precision", aerospace: "aerospace", hrms: "hrms", staffing: "staffing" } as const;

const CHIP = {
  w: { text: "Review", cls: "bg-orange-100 text-orange-800" },
  l: { text: "Late", cls: "bg-red-100 text-red-800" },
  r: { text: "Ready", cls: "bg-emerald-100 text-emerald-800" },
} as const;

function Sparkline({ values }: { values: number[] }) {
  const w = 96;
  const h = 22;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => `${((i * w) / (values.length - 1)).toFixed(1)},${(h - 2 - ((v - min) / (max - min || 1)) * (h - 4)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 block h-[22px] w-full" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#1e3a8a" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Timeline({ steps, active }: { steps: string[]; active: number }) {
  const n = steps.length;
  return (
    <div className="relative">
      <div className="absolute top-3 h-0.5 bg-slate-200" style={{ left: `${50 / n}%`, right: `${50 / n}%` }} aria-hidden="true" />
      <div
        className="absolute top-3 h-0.5 bg-blue-900 transition-[width] duration-500"
        style={{ left: `${50 / n}%`, width: `${((100 - 100 / n) * active) / (n - 1)}%` }}
        aria-hidden="true"
      />
      <ol className="relative flex">
        {steps.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <li key={step} aria-current={current ? "step" : undefined} className="min-w-0 flex-1 px-0.5 text-center">
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-blue-900 text-white"
                    : current
                      ? "bg-orange-300 text-orange-950 outline-[3px] outline-orange-100"
                      : "border-[1.5px] border-dashed border-slate-300 bg-white text-slate-400"
                }`}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={`mt-1.5 block text-[11px] leading-tight ${current ? "font-semibold text-slate-900" : done ? "text-slate-800" : "text-slate-400"}`}>
                {step}
              </span>
              {current ? <span className="sr-only">(in progress)</span> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ConsoleViewport({ tab }: { tab: ConsoleTab }) {
  const d = DATA[tab];
  const [approved, setApproved] = useState<Record<ConsoleTab, boolean>>({ precision: false, aerospace: false, hrms: false, staffing: false });
  const [simmed, setSimmed] = useState<Record<ConsoleTab, boolean>>({ precision: false, aerospace: false, hrms: false, staffing: false });

  const kpis = d.kpis.map((k, i) => {
    if (simmed[tab] && i === d.sim.kpi) {
      const spark = [...k.spark.slice(1), k.spark[k.spark.length - 1] * 1.04];
      return { ...k, value: d.sim.value, spark };
    }
    return k;
  });

  return (
    <div className="grid overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-2xl lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Photo panel */}
      <div className="relative min-h-56 bg-slate-300 lg:min-h-[34rem]">
        <Image
          key={tab}
          src={d.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 100vw"
          quality={70}
          className="animate-in fade-in object-cover duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-2.5 text-[11px] font-medium text-slate-900 shadow-sm">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" aria-hidden="true" />
          {d.chip}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 px-4 py-4 text-white">
          <p className="text-[11px] font-semibold tracking-wider text-orange-300 uppercase">Live preview</p>
          <p className="mt-1 text-lg leading-snug font-bold">{d.head}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{d.caption}</p>
        </div>
      </div>

      {/* Dashboard */}
      <div className="flex min-w-0 flex-col gap-3 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-blue-900 uppercase">{d.kicker}</p>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">{d.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSimmed((s) => ({ ...s, [tab]: true }))}
              className="cursor-pointer rounded-lg border-[1.5px] border-orange-500 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              {d.sim.label}
            </button>
            <Link href={hrefFor(PAGE_KEY[tab])} className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline">
              Full page <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] text-slate-500">{k.label}</p>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                <span className="text-xl font-extrabold text-slate-900">{k.value}</span>
                <span className={`rounded-full px-2 py-px text-[11px] ${k.good ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  {k.note}
                </span>
              </div>
              <Sparkline values={k.spark} />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between text-[11px] tracking-wider text-slate-500 uppercase">
            <span>{d.flowLabel}</span>
            <span>Where the work is</span>
          </div>
          <Timeline steps={d.steps} active={d.active} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between text-[11px] tracking-wider text-slate-500 uppercase">
              <span>Needs attention</span>
              <span className="normal-case">Sample data</span>
            </div>
            <ul>
              {d.rows.map(([label, value, kind]) => (
                <li key={label} className="flex items-center gap-2 border-t border-slate-100 py-2 text-xs first:border-t-0">
                  <span className="min-w-0 flex-1 text-slate-700">{label}</span>
                  <span className="font-bold text-slate-900">{value}</span>
                  <span className={`rounded-full px-2 py-px text-[11px] font-medium ${CHIP[kind].cls}`}>{CHIP[kind].text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`rounded-xl border p-3 sm:p-4 ${approved[tab] ? "border-emerald-200 bg-emerald-50" : "border-indigo-200 bg-indigo-50"}`}
            aria-live="polite"
          >
            {approved[tab] ? (
              <>
                <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CircleCheck className="size-4" aria-hidden="true" /> Approved by you
                </p>
                <p className="mt-2 text-xs leading-relaxed text-emerald-900">{d.ai.done}</p>
                <p className="mt-2 text-[11px] text-emerald-800">Recorded in the event history.</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Sparkles className="size-4" aria-hidden="true" /> Synax AI proposes
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-800">{d.ai.ask}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setApproved((a) => ({ ...a, [tab]: true }))}
                    className="cursor-pointer rounded-lg bg-blue-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Approve
                  </button>
                  <span className="text-[11px] text-slate-500">Agents only propose. An approver decides.</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
