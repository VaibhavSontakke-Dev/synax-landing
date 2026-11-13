import type { LucideIcon } from "lucide-react";
import { LIVE_PILLARS, LIVE_POSITIONING } from "../_data/live";
import { Breadcrumb } from "./site-page";
import { SectionTag } from "./section-tag";
import { TourButton } from "./demo-buttons";

/**
 * Hero of /why-synax, in the same family as the Security & Trust hero (bluish background, copy and ticks on the
 * left, a visual on the right, a row of cards below). The visual is a fan of the three pillars from the portal
 * (job-work native, machine to invoice, AI that acts), each with its title and first point, over a soft orange
 * "Free for SMEs" chip; the strip below is "Synax at a glance" (the page's proof facts). All wording is the page's
 * existing wording (see `_data/live.ts`). Server component, no motion.
 */

const TICKS = ["Built in India, for Indian shop floors", "Audit trail on every posting", "Works with Tally"];

/** Position and tilt of each pillar card on large screens (index = pillar order: 1, 2, 3). */
const FAN = [
  "lg:top-[15.5rem] lg:right-3 lg:rotate-[1.5deg]",
  "lg:top-[8rem] lg:right-12 lg:-rotate-2",
  "lg:top-[0.5rem] lg:right-0 lg:rotate-3",
];

export interface WhyProof {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: boolean;
}

export function WhyHero({ proof }: { proof: WhyProof[] }) {
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(30,58,138,0.1)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
        <div className="absolute -top-24 left-[30%] size-96 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-900" />
        <div className="absolute bottom-0 left-0 h-1 w-32 bg-sky-400" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
        <Breadcrumb items={[{ label: "Why Synax" }]} />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:pt-6">
            <SectionTag lines="start">Why Synax</SectionTag>
            <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              <span className="text-blue-900">Why industry leaders </span>choose Synax
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
              {LIVE_POSITIONING.headline} {LIVE_POSITIONING.sub}
            </p>
            <div className="mt-7">
              <TourButton title="Why Synax" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-slate-700" aria-label="Highlights">
              {TICKS.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="text-blue-900" aria-hidden="true">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* The three pillars, fanned out (stacked on small screens) */}
          <div className="relative lg:h-[26rem]">
            <span className="mb-3 inline-block rounded-full bg-orange-300 px-3 py-1 text-xs font-bold text-blue-950 shadow-md lg:absolute lg:top-0 lg:left-0 lg:z-10 lg:mb-0">
              Free for SMEs under 50 employees
            </span>
            <ol className="space-y-3 lg:space-y-0" aria-label="The three pillars">
              {LIVE_PILLARS.map((p, i) => (
                <li
                  key={p.kicker}
                  className={`rounded-xl border border-slate-300 bg-white p-4 shadow-lg shadow-blue-900/10 lg:absolute lg:w-[19.5rem] ${FAN[i] ?? ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-900 font-mono text-xs font-semibold text-white">{i + 1}</span>
                    <p className="text-[11px] font-bold tracking-wider text-orange-700 uppercase">{p.kicker}</p>
                  </div>
                  <p className="mt-2 text-sm leading-snug font-bold text-slate-900">{p.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{p.points[0]}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Synax at a glance */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">Synax at a glance</p>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Key facts">
            {proof.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.value} className={`flex items-center gap-3 rounded-xl border bg-white p-3.5 shadow-sm ${p.accent ? "border-orange-300" : "border-slate-300"}`}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base leading-tight font-extrabold text-blue-900">{p.value}</span>
                    <span className="block text-xs leading-snug text-slate-600">{p.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
