import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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

/** Message ids: "Why.hero.ticks.<id>". */
const TICKS = ["india", "audit", "tally"] as const;
/** The three pillars, in order (messages "Live.pillars.<id>"). */
const PILLARS = ["p1", "p2", "p3"] as const;

/** Position and tilt of each pillar card on large screens (index = pillar order: 1, 2, 3). */
const FAN = [
  "lg:top-[15.5rem] lg:right-3 lg:rotate-[1.5deg]",
  "lg:top-[8rem] lg:right-12 lg:-rotate-2",
  "lg:top-[0.5rem] lg:right-0 lg:rotate-3",
];

/**
 * A slow bob in place for each pillar card, like something floating on water: each card has its own duration, start offset and
 * height so they never move together. The look is the `synax-why-bob` rule in globals.css (vertical bob plus a 1 px drift, on
 * `transform`, so it adds to the tilt in FAN); here only the per-card numbers live. Pauses on hover, and the hovered card comes forward: it is raised above
 * the others (`hover:z-20`) and, over 0.5 s, lifts 8 px, grows 4%, straightens its tilt and deepens its shadow (these use the separate
 * `translate`, `scale` and `rotate` properties, so they add to the bob), then eases back when the pointer leaves; reduced motion: no animation.
 */
const BOB = [
  "[--bob-t:6.5s] [--bob-d:-1.5s] [--bob-y:-6px] [--bob-x:1px]",
  "[--bob-t:7.5s] [--bob-d:-4s] [--bob-y:-8px] [--bob-x:-1px]",
  "[--bob-t:5.5s] [--bob-d:-2.5s] [--bob-y:-5px] [--bob-x:1px]",
];

export interface WhyProof {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: boolean;
}

export function WhyHero({ proof }: { proof: WhyProof[] }) {
  const t = useTranslations("Why.hero");
  const live = useTranslations("Live");
  const nav = useTranslations("Nav");
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="synax-stars absolute inset-0" />
          <div className="absolute inset-0 [background-image:radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
        <div className="absolute -top-24 left-[30%] size-96 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-solid" />
        <div className="absolute bottom-0 left-0 h-1 w-32 bg-sky-400" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
        <Breadcrumb items={[{ label: nav("whySynax") }]} />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:pt-6">
            <SectionTag lines="start">{t("tag")}</SectionTag>
            <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t.rich("title", { b: (chunks) => <span className="text-brand">{chunks}</span> })}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
              {live("positioning.headline")} {live("positioning.sub")}
            </p>
            <div className="mt-7">
              <TourButton title="Why Synax" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-slate-700" aria-label={t("highlightsAria")}>
              {TICKS.map((tick) => (
                <li key={tick} className="flex items-center gap-1.5">
                  <span className="text-brand" aria-hidden="true">
                    ✓
                  </span>
                  {t(`ticks.${tick}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* The three pillars, fanned out (stacked on small screens) */}
          <div className="relative lg:h-[26rem]">
            <span className="mb-3 inline-block rounded-full bg-orange-300 px-3 py-1 text-xs font-bold text-blue-950 shadow-md lg:absolute lg:top-0 lg:left-0 lg:z-10 lg:mb-0">
              {t("free")}
            </span>
            <ol className="space-y-3 lg:space-y-0" aria-label={t("pillarsAria")}>
              {PILLARS.map((p, i) => (
                <li
                  key={p}
                  className={`synax-why-bob rounded-xl border border-slate-300 bg-surface p-4 shadow-lg shadow-brand-line/10 transition-[box-shadow,border-color,scale,translate,rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-20 hover:-translate-y-2 hover:scale-[1.04] hover:border-brand-line/50 hover:shadow-2xl focus-within:z-20 motion-reduce:transition-none lg:hover:rotate-0 lg:absolute lg:w-[19.5rem] ${FAN[i] ?? ""} ${BOB[i] ?? ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid font-mono text-xs font-semibold text-white">{i + 1}</span>
                    <p className="text-[11px] font-bold tracking-wider text-accent-strong uppercase">{live(`pillars.${p}.kicker`)}</p>
                  </div>
                  <p className="mt-2 text-sm leading-snug font-bold text-slate-900">{live(`pillars.${p}.title`)}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{live(`pillars.${p}.a`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Synax at a glance */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">{t("glance")}</p>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={t("factsAria")}>
            {proof.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.value} className={`flex items-center gap-3 rounded-xl border bg-surface p-3.5 shadow-sm ${p.accent ? "border-orange-300" : "border-slate-300"}`}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-brand">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base leading-tight font-extrabold text-brand">{p.value}</span>
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
