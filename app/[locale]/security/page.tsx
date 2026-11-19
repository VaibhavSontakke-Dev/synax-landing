import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LIVE_COMPLIANCE, LIVE_SECURITY, LIVE_SOURCE } from "../../erp/_data/live";
import { Block, CtaBand } from "../../erp/_components/site-page";
import { SecurityHero } from "../../erp/_components/security-hero";
import { JumpBar } from "../../erp/_components/jump-bar";
import { SectionTag } from "../../erp/_components/section-tag";
import { Reveal } from "../../erp/_components/reveal";
import { TONE } from "../../erp/_components/route-tone";
import { ModuleIcon } from "../../erp/_components/icons";
import type { IconName } from "../../erp/_data/content";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Meta.security");
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/security", locale),
    openGraph: { title: t("ogTitle"), description: t("ogDescription"), type: "website" },
  };
}

/*
 * Source: the live portal's "Security & control" section, FAQ and metadata (see _data/live.ts). Nothing here
 * is invented. Removed from the earlier draft because the live site does not say it: "99.9% availability",
 * encryption specifics, "monitored 24/7", ISO 9001, CMMC, ITAR/EAR vault. Add any back only once the owner
 * confirms it. Every word comes from messages/*.json ("Security", "Live", "Footer", "Home").
 */
const [TENANT, SERVER, AUDIT, ROLES] = LIVE_SECURITY;

/** Structure of the six controls. The first four use the portal's security texts ("Live.security.<id>"), the last two have their own. */
const PILLARS: { id: "tenant" | "server" | "audit" | "roles" | "ai" | "material"; icon: IconName; tone: keyof typeof TONE }[] = [
  { id: "tenant", icon: TENANT.icon, tone: "navy" },
  { id: "server", icon: SERVER.icon, tone: "navy" },
  { id: "audit", icon: AUDIT.icon, tone: "navy" },
  { id: "roles", icon: ROLES.icon, tone: "navy" },
  { id: "ai", icon: "bolt", tone: "orange" },
  { id: "material", icon: "box", tone: "orange" },
];

const OURS = ["o1", "o2", "o3", "o4"] as const;
const YOURS = ["y1", "y2", "y3", "y4"] as const;

/** What happens to a posting, using only statements from the live portal. */
const PROCESS: { id: "role" | "server" | "approval" | "audit"; icon: IconName }[] = [
  { id: "role", icon: "lock" },
  { id: "server", icon: "shield" },
  { id: "approval", icon: "bolt" },
  { id: "audit", icon: "badge" },
];

const JUMP_IDS = ["controls", "process", "compliance", "responsibility", "legal"] as const;
const COMPLIANCE_IDS = ["c1", "c2", "c3", "c4"] as const;

/** /security — same layout language as /solutions: hero + card, sky band of cards, then alternating blocks. */
export default function SecurityPage() {
  const t = useTranslations("Security");
  const live = useTranslations("Live");
  const footer = useTranslations("Footer");
  const home = useTranslations("Home");

  /** Title and one-line summary of a control: the portal's own text for the first four, the page's own for the last two. */
  const controlTitle = (id: (typeof PILLARS)[number]["id"]) =>
    id === "ai" || id === "material" ? t(`pillars.${id}.title`) : live(`security.${id}.title`);
  const controlSummary = (id: (typeof PILLARS)[number]["id"]) =>
    id === "ai" || id === "material" ? t(`pillars.${id}.summary`) : live(`security.${id}.copy`);
  /** Process step copy: the portal's own text for the server and audit checks. */
  const stepCopy = (id: (typeof PROCESS)[number]["id"]) =>
    id === "server" ? live("security.server.copy") : id === "audit" ? live("security.audit.copy") : t(`process.${id}.copy`);

  return (
    <main>
      <SecurityHero gates={PROCESS.map((p) => ({ id: p.id, title: t(`process.${p.id}.title`), copy: t(`process.${p.id}.short`) }))} />

      <JumpBar items={JUMP_IDS.map((id) => ({ id, label: t(`jump.${id}`) }))} />

      {/* Controls */}
      <section id="controls" aria-labelledby="controls-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>{home("security.tag")}</SectionTag>
            <h2 id="controls-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("controls.title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t("controls.lead")}</p>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => {
              const tone = TONE[p.tone];
              return (
                <Reveal key={p.id} as="li" delay={(i % 3) * 70} className="flex">
                  <article
                    aria-labelledby={`control-${i}-title`}
                    className={`flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                        <ModuleIcon name={p.icon} className="size-5" />
                      </span>
                      <h3 id={`control-${i}-title`} className="text-[15px] leading-snug font-bold text-slate-900">
                        {controlTitle(p.id)}
                      </h3>
                    </div>
                    <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">
                      <span className="block text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t("controls.whatItDoes")}</span>
                      {controlSummary(p.id)}
                    </p>
                    <p className="mt-4 text-[11px] font-bold tracking-wider text-brand uppercase">{t("controls.inPractice")}</p>
                    <ul className="mt-2 space-y-1.5">
                      {(["a", "b"] as const).map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                          <span>{t(`pillars.${p.id}.${pt}`)}</span>
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

      {/* How a posting is protected */}
      <Block id="process" tag={t("jump.process")} title={t("process.title")} lead={t("process.lead")} tone="white">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.id} className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="flex size-9 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-brand">
                  <ModuleIcon name={step.icon} className="size-[18px]" />
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">{t(`process.${step.id}.title`)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{stepCopy(step.id)}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* Compliance */}
      <Block id="compliance" tag={footer("complianceHeading")} title={t("compliance.title")} lead={t("compliance.lead")}>
        <dl className="grid gap-4 sm:grid-cols-2">
          {LIVE_COMPLIANCE.map((c, i) => (
            <div key={c.name} className="flex gap-3 rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-accent">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[15px] font-bold text-slate-900">{live(`compliance.${COMPLIANCE_IDS[i]}.name`)}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-600">{live(`compliance.${COMPLIANCE_IDS[i]}.how`)}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Block>

      {/* Shared responsibility */}
      <Block id="responsibility" tag={t("responsibility.tag")} title={t("responsibility.title")} lead={t("responsibility.lead")} tone="white">
        <div className="grid gap-5 md:grid-cols-2">
          <section aria-labelledby="ours-heading" className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
            <h3 id="ours-heading" className="text-[15px] font-bold text-slate-900">{t("responsibility.oursTitle")}</h3>
            <ul className="mt-3 space-y-2">
              {OURS.map((o) => (
                <li key={o} className="flex gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                  {t(`responsibility.${o}`)}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="yours-heading" className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
            <h3 id="yours-heading" className="text-[15px] font-bold text-slate-900">{t("responsibility.yoursTitle")}</h3>
            <ul className="mt-3 space-y-2">
              {YOURS.map((o) => (
                <li key={o} className="flex gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                  {t(`responsibility.${o}`)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Block>

      {/* Privacy and terms */}
      <Block id="legal" tag={t("jump.legal")} title={t("legal.title")} lead={t("legal.lead")}>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: footer("privacy"), href: "/privacy" },
            { label: footer("terms"), href: "/terms" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-md border-2 border-orange-500 bg-surface px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              {l.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          {t.rich("legal.source", {
            link: (chunks) => (
              <a href={LIVE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
                {chunks}
              </a>
            ),
          })}
        </p>
      </Block>

      <CtaBand tone="light" tourTitle="Synax Security Overview" title={t("cta.title")} text={t("cta.text")} product="Security & Trust Review" />
    </main>
  );
}
