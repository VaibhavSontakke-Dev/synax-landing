"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Cpu,
  Infinity as InfinityIcon,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { SectionTag } from "./section-tag";

/**
 * "The Ecosystem Purpose" section.
 *
 * A 2×2 chequerboard of the four purpose pillars (navy / light / light / navy)
 * joined by a central "One continuum" hub (md+). Copy is the original section's,
 * unchanged; each pillar's long paragraph is clamped to three lines with a
 * "Read more" toggle so nothing is lost.
 */

interface Pillar {
  Icon: LucideIcon;
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  chips: [string, string];
  /** navy = filled tile with light text, light = white tile. */
  tone: "navy" | "light";
}

const PILLARS: Pillar[] = [
  {
    Icon: ShieldCheck,
    tag: "Precision & Compliance",
    title: "Industry-Focused Solutions",
    subtitle: "Domain-native workflows instead of generic ERP workarounds",
    body: "We reject one-size-fits-all software. Every module in Synax is calibrated for the exact operational realities of high-stakes industries — from AS9100 Rev D audit readiness and ITAR defense data vaulting in aerospace, to multi-axis CNC machine loading and First Article Inspection Reports (AS9102 FAIR) on precision shop floors.",
    chips: ["AS9100D & ITAR Native", "Zeiss/Hexagon CMM Sync"],
    tone: "navy",
  },
  {
    Icon: TrendingUp,
    tag: "Operational Velocity",
    title: "Smarter Business Operations",
    subtitle: "Single source of truth from raw ingot receipt to customer dispatch",
    body: "Synax breaks the barrier between the front office and the shop floor. By capturing real-time machine telemetry, material heat-lot certifications, and stage-by-stage scrap rates, leadership gains true OEE visibility and predictive capacity dispatch without waiting for end-of-month manual reconciliation.",
    chips: ["360° Material Lot Genealogy", "Dynamic Machine Dispatch"],
    tone: "light",
  },
  {
    Icon: Users,
    tag: "Human Capital Intelligence",
    title: "Better Workforce Management",
    subtitle: "Unifying permanent floor staff with contingent technical talent",
    body: "High-precision delivery requires the right certified specialist on every shift. Synax bridges biometric turnstile punch-ins, plant floor break-pass monitoring, and <60s automated payroll with an AI-powered talent bench that sources and validates certified engineers and machinists on demand.",
    chips: ["Biometric IoT Turnstile Sync", "AI Bench Matching & VMS"],
    tone: "light",
  },
  {
    Icon: Cpu,
    tag: "Modern Tech Architecture",
    title: "Technology-Driven Transformation",
    subtitle: "Cloud-native scale, IoT sensor telematics & immutable security",
    body: "Replacing clunky legacy on-premise architectures with modern, cloud-native engineering. Synax combines edge CNC machine connectivity, CMM inspection interfaces, automated cryptographic audit trails, and bank-grade 256-bit AES encryption to deliver resilient, continuous digital transformation.",
    chips: ["Direct CNC IoT Machine Data", "256-bit AES & Immutable Logs"],
    tone: "navy",
  },
];

function PillarTile({ pillar, index }: { pillar: Pillar; index: number }) {
  const [open, setOpen] = useState(false);
  const navy = pillar.tone === "navy";
  const { Icon } = pillar;
  const bodyId = `purpose-body-${index}`;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl p-5 sm:p-6 ${
        navy
          ? "bg-blue-900 text-white shadow-lg"
          : "border border-slate-200/90 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex size-10 items-center justify-center rounded-xl ${
            navy ? "bg-white/15 text-orange-300" : "bg-orange-50 text-orange-600"
          }`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span
          className={`text-3xl leading-none font-semibold tabular-nums ${
            navy ? "text-white/25" : "text-slate-200"
          }`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <span
        className={`mt-3 inline-block self-start rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
          navy ? "bg-white/15 text-orange-300" : "bg-orange-50 text-orange-700"
        }`}
      >
        {pillar.tag}
      </span>

      <h3 className="mt-2 text-lg leading-snug font-bold">{pillar.title}</h3>
      <p className={`mt-0.5 text-xs font-medium ${navy ? "text-slate-300" : "text-slate-500"}`}>
        {pillar.subtitle}
      </p>

      <p
        id={bodyId}
        className={`mt-3 text-[0.8125rem] leading-relaxed ${navy ? "text-slate-200" : "text-slate-600"} ${
          open ? "" : "line-clamp-3"
        }`}
      >
        {pillar.body}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className={`mt-1.5 inline-flex cursor-pointer items-center gap-1 self-start rounded-sm text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
          navy ? "text-orange-300 hover:text-orange-200" : "text-orange-700 hover:text-orange-800"
        }`}
      >
        {open ? "Show less" : "Read more"}
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <ul className="mt-auto flex flex-wrap gap-2 pt-4">
        {pillar.chips.map((chip) => (
          <li
            key={chip}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
              navy ? "bg-white/12 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            <CircleCheck
              className={`size-3.5 shrink-0 ${navy ? "text-orange-300" : "text-orange-600"}`}
              aria-hidden="true"
            />
            {chip}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Purpose({ onExplore }: { onExplore: () => void }) {
  return (
    <section
      id="purpose"
      aria-labelledby="purpose-heading"
      className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/70 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionTag>The Ecosystem Purpose</SectionTag>
          <h2
            id="purpose-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            The Larger Purpose Behind the Synax Ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed font-normal text-slate-600 sm:text-sm md:text-base">
            Traditional ERPs were built for finance departments, forcing shop floor engineers, quality
            leads, and workforce managers to survive on fragmented spreadsheets. Synax exists to unify
            high-precision execution, human capital, and regulatory compliance into one cohesive
            continuum.
          </p>
          <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500 line-through">
              Fragmented spreadsheets
            </span>
            <ArrowRight className="size-4 text-orange-600" aria-hidden="true" />
            <span className="rounded-full bg-blue-900 px-3 py-1.5 text-white">One cohesive continuum</span>
          </p>
        </div>

        {/* Four pillars joined by a hub */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {PILLARS.map((pillar, index) => (
              <PillarTile key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>

          <div
            className="absolute top-1/2 left-1/2 z-10 hidden size-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-orange-600 text-center text-white ring-[7px] ring-white md:flex"
            aria-hidden="true"
          >
            <InfinityIcon className="size-5" />
            <span className="mt-0.5 text-[11px] leading-tight font-semibold">
              One
              <br />
              continuum
            </span>
          </div>
        </div>

        {/* Closing banner */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 md:flex-row md:items-center">
          <div className="max-w-xl space-y-1">
            <SectionTag lines="start">Senwell Group Engineering Discipline</SectionTag>
            <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              One Unified Continuum. Zero Disconnected Tools.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Every tier of Synax works in synchrony: from hiring and biometric clock-in to CNC
              machining and AS9100 aerospace release.
            </p>
          </div>
          <button
            type="button"
            onClick={onExplore}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <span>Explore Platform Synergy</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
