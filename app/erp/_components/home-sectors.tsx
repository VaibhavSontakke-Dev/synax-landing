"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AlertCircle, ArrowDown, ArrowRight, Check } from "lucide-react";
import { SectionTag } from "./section-tag";
import { TONE } from "./route-tone";
import { SOLUTION_ICON } from "./solution-icons";
import { SOLUTIONS, SOLUTION_GROUPS, solutionByKey, type SolutionGroup, type SolutionKey } from "../_data/solutions";

/**
 * "Sector & Challenge Alignment": solutions seen three ways.
 *
 * A switch on top picks the lens (Industries we serve / How you manufacture / Business needs). Under it, the
 * familiar master-detail: the lens's list on the left and one detail panel with the challenge, how Synax solves
 * it, the key capabilities, a "Works with" row that jumps to related solutions in the other lenses, and the
 * Explore link. Copy lives in _data/solutions.ts (shared with the /solutions page). The numeric "Measurable ROI"
 * chips of the original section stay dropped: add a results strip back only with real data.
 */

const firstOf = (group: SolutionGroup) => SOLUTIONS.find((s) => s.group === group)!.key;

export function Sectors() {
  const t = useTranslations("Sectors");
  const ts = useTranslations("Solutions");
  const tg = useTranslations("SolutionGroups");
  const tp = useTranslations("Products");
  const [group, setGroup] = useState<SolutionGroup>("industry");
  const [activeKey, setActiveKey] = useState<SolutionKey>(firstOf("industry"));
  const tabRefs = useRef<Partial<Record<SolutionKey, HTMLButtonElement | null>>>({});

  const items = SOLUTIONS.filter((s) => s.group === group);
  const sector = solutionByKey(activeKey);
  const active = Math.max(0, items.findIndex((s) => s.key === activeKey));
  const tile = TONE[sector.tone].tile;
  const SectorIcon = SOLUTION_ICON[sector.key];

  const chooseGroup = (g: SolutionGroup) => {
    setGroup(g);
    setActiveKey(firstOf(g));
  };

  /** From a "Works with" chip: switch to that solution's lens and select it, then move focus to its tab. */
  const jumpTo = (key: SolutionKey) => {
    setGroup(solutionByKey(key).group);
    setActiveKey(key);
    requestAnimationFrame(() => tabRefs.current[key]?.focus());
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      const key = items[next].key;
      setActiveKey(key);
      tabRefs.current[key]?.focus();
    }
  };

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="mx-auto max-w-7xl scroll-mt-20 border-t border-slate-200/80 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Header */}
      <div data-anim-stagger="rise" className="mx-auto mb-8 max-w-3xl space-y-3 text-center">
        <SectionTag>{t("tag")}</SectionTag>
        <h2 id="solutions-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm md:text-base">
          {t("lead")}
        </p>
      </div>

      {/* Lens switch */}
      <div data-anim="rise" className="mb-6 flex justify-center">
        <div
          role="group"
          aria-label={t("viewBy")}
          className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SOLUTION_GROUPS.map((g) => {
            const on = g.id === group;
            const count = SOLUTIONS.filter((s) => s.group === g.id).length;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={on}
                onClick={() => chooseGroup(g.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:px-4 sm:text-sm ${
                  on ? "bg-surface text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tg(`${g.id}.label`)}
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                    on ? "bg-orange-100 text-accent-strong" : "bg-slate-200/70 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div data-anim="rise-lg" className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        {/* The lens's list: horizontal scroller on small screens, a list from lg */}
        <div>
          <p className="mb-2 hidden px-2.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase lg:block">
            {tg(`${group}.lead`)}
          </p>
          <div
            role="tablist"
            aria-label={tg(`${group}.label`)}
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((s) => {
              const on = s.key === activeKey;
              const Icon = SOLUTION_ICON[s.key];
              return (
                <button
                  key={s.key}
                  ref={(el) => {
                    tabRefs.current[s.key] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`sector-tab-${s.key}`}
                  aria-selected={on}
                  aria-controls="sector-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActiveKey(s.key)}
                  className={`flex min-w-[15rem] shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-l-[3px] px-2.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 lg:min-w-0 lg:shrink ${
                    on
                      ? "border-slate-200 border-l-orange-400 bg-surface text-slate-900 shadow-sm"
                      : "border-transparent text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${TONE[s.tone].tile}`}>
                    <Icon className="size-[17px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-tight font-semibold">{ts(`${s.key}.title`)}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">{ts(`${s.key}.short`)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div
          id="sector-panel"
          role="tabpanel"
          aria-labelledby={`sector-tab-${sector.key}`}
          className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${tile}`}>
              <SectorIcon className="size-3.5" aria-hidden="true" />
              {ts(`${sector.key}.tag`)}
            </span>
            <span className="text-xs text-slate-500">
              {t.rich("poweredBy", {
                name: tp(`${sector.product}.name`),
                b: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
              })}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{ts(`${sector.key}.title`)}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{ts(`${sector.key}.description`)}</p>

          {/* Challenge → solution */}
          <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <span className="flex size-5 items-center justify-center rounded-md bg-orange-50 text-accent-strong">
                  <AlertCircle className="size-3.5" aria-hidden="true" />
                </span>
                {t("challengeTitle")}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">{ts(`${sector.key}.challenge`)}</p>
            </div>

            <div className="flex items-center justify-center text-orange-400" aria-hidden="true">
              <ArrowRight className="hidden size-5 md:block" />
              <ArrowDown className="size-5 md:hidden" />
            </div>

            <div className="rounded-xl border-2 border-brand-line bg-surface p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <span className="flex size-5 items-center justify-center rounded-md bg-brand-solid text-white">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {t("solveTitle")}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">{ts(`${sector.key}.solution`)}</p>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{t("capabilities")}</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {(["c1", "c2", "c3", "c4"] as const).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                  {ts(`${sector.key}.${item}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Works with: related solutions in the other lenses */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{t("worksWith")}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {sector.related.map((key) => {
                const r = solutionByKey(key);
                const RIcon = SOLUTION_ICON[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => jumpTo(key)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-orange-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    >
                      <RIcon className="size-3.5 text-slate-500" aria-hidden="true" />
                      {ts(`${key}.title`)}
                      <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                        {tg(`${r.group}.short`)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Link
              href={sector.href}
              className="flex items-center gap-1.5 rounded-lg border-2 border-orange-500 bg-transparent px-4 py-[10px] text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <span>{t("explore")}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
        {t("notListed")}
        <Link
          href="/solutions"
          className="inline-flex items-center gap-1 rounded-sm border-b-2 border-orange-400 font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          {t("seeAll")}
          <ArrowRight className="size-3.5 text-orange-500" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
