"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  /** Message id: the texts live in messages/*.json under "Purpose.pillars.<id>". */
  id: "industry" | "operations" | "workforce" | "technology";
  /** navy = filled tile with light text, light = white tile. */
  tone: "navy" | "light";
}

const PILLARS: Pillar[] = [
  { Icon: ShieldCheck, id: "industry", tone: "navy" },
  { Icon: TrendingUp, id: "operations", tone: "light" },
  { Icon: Users, id: "workforce", tone: "light" },
  { Icon: Cpu, id: "technology", tone: "navy" },
];

function PillarTile({ pillar, index }: { pillar: Pillar; index: number }) {
  const t = useTranslations("Purpose");
  const [open, setOpen] = useState(false);
  const navy = pillar.tone === "navy";
  const { Icon } = pillar;
  const bodyId = `purpose-body-${index}`;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl p-5 sm:p-6 ${
        navy
          ? "keep-light-palette bg-brand-solid text-white shadow-lg"
          : "border border-slate-200/90 bg-surface text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex size-10 items-center justify-center rounded-xl ${
            navy ? "bg-white/15 text-orange-300" : "bg-orange-50 text-accent"
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
          navy ? "bg-white/15 text-orange-300" : "bg-orange-50 text-accent-strong"
        }`}
      >
        {t(`pillars.${pillar.id}.tag`)}
      </span>

      <h3 className="mt-2 text-lg leading-snug font-bold">{t(`pillars.${pillar.id}.title`)}</h3>
      <p className={`mt-0.5 text-xs font-medium ${navy ? "text-slate-300" : "text-slate-500"}`}>
        {t(`pillars.${pillar.id}.subtitle`)}
      </p>

      <p
        id={bodyId}
        className={`mt-3 text-[0.8125rem] leading-relaxed ${navy ? "text-slate-200" : "text-slate-600"} ${
          open ? "" : "line-clamp-3"
        }`}
      >
        {t(`pillars.${pillar.id}.body`)}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className={`mt-1.5 inline-flex cursor-pointer items-center gap-1 self-start rounded-sm text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
          navy ? "text-orange-300 hover:text-orange-200" : "text-accent-strong hover:text-accent-strong"
        }`}
      >
        {open ? t("showLess") : t("readMore")}
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <ul className="mt-auto flex flex-wrap gap-2 pt-4">
        {(["c1", "c2"] as const).map((chip) => (
          <li
            key={chip}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
              navy ? "bg-white/12 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            <CircleCheck
              className={`size-3.5 shrink-0 ${navy ? "text-orange-300" : "text-accent"}`}
              aria-hidden="true"
            />
            {t(`pillars.${pillar.id}.${chip}`)}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Purpose() {
  const t = useTranslations("Purpose");
  return (
    <section
      id="purpose"
      aria-labelledby="purpose-heading"
      className="scroll-mt-20 border-t border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-page to-slate-50/70 py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-anim-stagger="rise" className="mx-auto mb-8 max-w-3xl text-center">
          <SectionTag>{t("tag")}</SectionTag>
          <h2
            id="purpose-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed font-normal text-slate-600 sm:text-sm md:text-base">
            {t("lead")}
          </p>
          <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500 line-through">
              {t("from")}
            </span>
            <ArrowRight className="size-4 text-accent" aria-hidden="true" />
            <span className="rounded-full bg-brand-solid px-3 py-1.5 text-white">{t("to")}</span>
          </p>
        </div>

        {/* Four pillars joined by a hub */}
        <div className="relative">
          <div data-anim-stagger="scale" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {PILLARS.map((pillar, index) => (
              <PillarTile key={pillar.id} pillar={pillar} index={index} />
            ))}
          </div>

          <div
            className="absolute top-1/2 left-1/2 z-10 hidden size-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-orange-600 text-center text-white ring-[7px] ring-surface md:flex"
            aria-hidden="true"
          >
            <InfinityIcon className="size-5" />
            <span className="mt-0.5 text-[11px] leading-tight font-semibold">
              {t.rich("hub", { br: () => <br /> })}
            </span>
          </div>
        </div>

        {/* Closing banner */}
        <div data-anim="rise" className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 md:flex-row md:items-center">
          <div className="max-w-xl space-y-1">
            <SectionTag lines="start">{t("banner.tag")}</SectionTag>
            <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              {t("banner.title")}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {t("banner.lead")}
            </p>
          </div>
          <Link
            href="/why-synax"
            className="flex shrink-0 items-center gap-2 rounded-lg border-2 border-orange-500 bg-surface px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <span>{t("banner.cta")}</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
