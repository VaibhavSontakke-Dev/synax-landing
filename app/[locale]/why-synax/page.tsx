import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BadgeIndianRupee, Check, Cpu, FileCheck2, PackageCheck, Receipt, Sparkles, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { BENCHMARK } from "../../erp/_data/benchmark";
import { PLATFORM_BENEFITS } from "../../erp/_data/content";
import { LIVE_CLIENTS, LIVE_FAQ } from "../../erp/_data/live";
import { TONE } from "../../erp/_components/route-tone";
import { Block, CtaBand, Faq } from "../../erp/_components/site-page";
import { WhyHero } from "../../erp/_components/why-hero";
import { WhyRace } from "../../erp/_components/why-race";
import { Reveal } from "../../erp/_components/reveal";
import { SectionTag } from "../../erp/_components/section-tag";
import { ReasonTabs } from "../../erp/_components/reason-tabs";
import { JumpBar } from "../../erp/_components/jump-bar";
import { ModuleIcon } from "../../erp/_components/icons";
import { localizedAlternates } from "@/i18n/seo";
import { slug } from "@/i18n/slug";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Meta.why");
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/why-synax", locale),
    openGraph: { title: t("ogTitle"), description: t("ogDescription"), type: "website" },
  };
}

/** Benchmark row icon -> the module icon set used elsewhere on the site. */
const ROW_ICON = { cpu: "machine", filecheck: "badge", clock: "device", sparkles: "bolt", receipt: "box" } as const;

/** One icon + colour per pillar (messages "Live.pillars.p1..p3", same order). */
const PILLAR_STYLE: { id: "p1" | "p2" | "p3"; icon: LucideIcon; tone: keyof typeof TONE }[] = [
  { id: "p1", icon: PackageCheck, tone: "navy" },
  { id: "p2", icon: Cpu, tone: "orange" },
  { id: "p3", icon: Sparkles, tone: "emerald" },
];

const POINTS = ["a", "b", "c", "d"] as const;
const FLOW_IDS = ["f1", "f2", "f3", "f4", "f5", "f6"] as const;

/** Facts on the hero card (all from the live portal; see _data/live.ts). Words: messages "Why.proof.<id>". */
const PROOF: { id: "free" | "tally" | "gst" | "qms"; icon: LucideIcon; accent?: boolean }[] = [
  { id: "free", icon: BadgeIndianRupee, accent: true },
  { id: "tally", icon: Receipt },
  { id: "gst", icon: FileCheck2 },
  { id: "qms", icon: Check },
];

const JUMP_IDS = ["difference", "pillars", "flow", "reasons", "compare", "pricing", "faq"] as const;

/**
 * /why-synax — same layout language as /solutions: hero + card, sky band of cards, then alternating blocks.
 * Structure comes from the data files; every word comes from messages/*.json ("Why", "Live", "Benefits", "Benchmark",
 * "Comparison", "Faq", "Home").
 */
export default function WhySynaxPage() {
  const t = useTranslations("Why");
  const live = useTranslations("Live");
  const tb = useTranslations("Benefits");
  const bm = useTranslations("Benchmark");
  const tc = useTranslations("Comparison");
  const tf = useTranslations("Faq");
  const home = useTranslations("Home");

  const legacy = tc("timeline.legacy.name");
  const point = tc("timeline.point.name");

  const proof = PROOF.map((p) => ({ icon: p.icon, accent: p.accent, value: t(`proof.${p.id}.value`), label: t(`proof.${p.id}.label`) }));
  const jump = JUMP_IDS.map((id) => ({ id, label: t(`jump.${id}`) }));
  const reasons = PLATFORM_BENEFITS.map((b) => {
    const key = b.id.replace("benefit-", "");
    return {
      id: b.id,
      tab: tb(`${key}.tab`),
      question: tb(`${key}.question`),
      answer: tb(`${key}.answer`),
      points: (["p1", "p2", "p3"] as const).map((p) => tb(`${key}.${p}`)),
      icon: b.icon,
    };
  });

  return (
    <main>
      <WhyHero proof={proof} />

      {/* Jump bar: the current section is navy */}
      <JumpBar items={jump} />

      {/* The animated comparison: one part, two ways to run it */}
      <Block id="difference" tag={t("difference.tag")} title={t("difference.title")} lead={t("difference.lead")} tone="white">
        <WhyRace />
      </Block>

      {/* Pillars */}
      <section id="pillars" aria-labelledby="pillars-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>{t("pillars.tag")}</SectionTag>
            <h2 id="pillars-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("pillars.title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t("pillars.lead")}</p>
          </div>

          <ul className="grid gap-5 lg:grid-cols-3">
            {PILLAR_STYLE.map((p, i) => {
              const tone = TONE[p.tone];
              const Icon = p.icon;
              return (
                <Reveal key={p.id} as="li" delay={i * 70} className="flex">
                  <article
                    aria-labelledby={`pillar-${i}-title`}
                    className={`flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{live(`pillars.${p.id}.kicker`)}</p>
                    </div>
                    <h3 id={`pillar-${i}-title`} className="mt-4 text-base leading-snug font-bold text-slate-900">
                      {live(`pillars.${p.id}.title`)}
                    </h3>
                    <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">
                      {live(`pillars.${p.id}.copy`)}
                    </p>
                    <p className="mt-4 text-[11px] font-bold tracking-wider text-brand uppercase">{t("pillars.whatYouGet")}</p>
                    <ul className="mt-2 space-y-1.5">
                      {POINTS.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                          <span>{live(`pillars.${p.id}.${pt}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Flow */}
      <Block id="flow" tag={t("flow.tag")} title={t("flow.title")} lead={live("flow.lead")} tone="white">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {FLOW_IDS.map((id, i) => {
            const emphasis = i === 3;
            return (
              <li
                key={id}
                className={`flex flex-col rounded-2xl border border-t-4 bg-surface p-4 shadow-sm ${
                  emphasis ? "border-slate-200 border-t-orange-500" : "border-slate-200 border-t-blue-900"
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full font-mono text-sm font-semibold ${
                    emphasis ? "bg-orange-300 text-orange-950" : "bg-brand-solid text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm leading-snug font-bold text-slate-900">{live(`flow.${id}.title`)}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{live(`flow.${id}.copy`)}</p>
              </li>
            );
          })}
        </ol>
      </Block>

      {/* Reasons */}
      <Block id="reasons" tag={t("reasons.tag")} title={t("reasons.title")} lead={t("reasons.lead")}>
        <ReasonTabs items={reasons} />
      </Block>

      {/* Comparison */}
      <Block id="compare" tag={t("compare.tag")} title={t("compare.title")} lead={t("compare.lead")} tone="white">
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">{t("compare.caption")}</caption>
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-600">
                <th scope="col" className="px-5 py-3.5">{t("compare.capability")}</th>
                <th scope="col" className="bg-brand-solid px-5 py-3.5 text-white">Synax</th>
                <th scope="col" className="px-5 py-3.5">{legacy}</th>
                <th scope="col" className="px-5 py-3.5">{point}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {BENCHMARK.map((r) => (
                <tr key={r.icon}>
                  <th scope="row" className="px-5 py-4 font-bold text-slate-900">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-brand">
                        <ModuleIcon name={ROW_ICON[r.icon]} className="size-4" />
                      </span>
                      {bm(`${r.icon}.title`)}
                    </span>
                  </th>
                  <td className="bg-sky-50 px-5 py-4 font-semibold text-slate-900">
                    <span className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {bm(`${r.icon}.synax`)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="flex gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                      {bm(`${r.icon}.legacy`)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="flex gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                      {bm(`${r.icon}.point`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-4 md:hidden">
          {BENCHMARK.map((r) => (
            <li key={r.icon} className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">{bm(`${r.icon}.title`)}</h3>
              <p className="mt-2 flex gap-2 rounded-lg bg-sky-50 p-2.5 text-sm font-semibold text-slate-900">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="sr-only">{tc("synaxSr")}</span>
                  {bm(`${r.icon}.synax`)}
                </span>
              </p>
              <p className="mt-2 flex gap-2 text-sm text-slate-600">
                <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{legacy}:</span> {bm(`${r.icon}.legacy`)}
                </span>
              </p>
              <p className="mt-1.5 flex gap-2 text-sm text-slate-600">
                <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{point}:</span> {bm(`${r.icon}.point`)}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-slate-500">{t("compare.note")}</p>
      </Block>

      {/* Pricing */}
      <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-32 border-y border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <SectionTag>{t("pricing.tag")}</SectionTag>
            <h2 id="pricing-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {live("pricing.headline")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{live("pricing.copy")}</p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-orange-300 px-5 py-2.5 text-sm font-semibold text-orange-950 transition-colors hover:bg-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {t("pricing.cta")} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Block id="faq" tag={t("faq.tag")} title={t("faq.title")} lead={t("faq.lead")}>
        <Faq items={LIVE_FAQ.map((f) => ({ q: tf(`${slug(f.q)}.q`), a: tf(`${slug(f.q)}.a`) }))} />
      </Block>

      {/* Heritage */}
      <Block id="heritage" tag={home("heritage.tag")} title={home("heritage.title")} lead={t("heritage.lead")} tone="white">
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" aria-label={home("clients.tag")}>
          {LIVE_CLIENTS.slice(1).map((name) => (
            <li key={name} className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-center text-sm font-bold text-slate-900 shadow-sm">
              {name}
            </li>
          ))}
        </ul>
      </Block>

      <CtaBand tone="light" tourTitle="Why Synax" title={t("cta.title")} text={t("cta.text")} />
    </main>
  );
}
