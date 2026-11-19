import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, Cog, Layers, MessageSquare, Package, Plus, Receipt, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { hrefFor } from "../../erp/_data/products";
import { SOLUTIONS, SOLUTION_GROUPS, type Solution } from "../../erp/_data/solutions";
import { AREAS, SOLUTION_PATHS, type AreaName } from "../../erp/_data/solution-paths";
import { INDUSTRY_PAGES, industryHref } from "../../erp/_data/industries";
import { WORKFLOW_STAGES } from "../../erp/_data/content";
import { LIVE_FAQ, LIVE_MODULES } from "../../erp/_data/live";
import { Block, CtaBand, Faq, PageHero } from "../../erp/_components/site-page";
import { TONE } from "../../erp/_components/route-tone";
import { Reveal } from "../../erp/_components/reveal";
import { SectionTag } from "../../erp/_components/section-tag";
import { INDUSTRY_ICON } from "../../erp/_components/industry-icons";
import { SolutionsScene } from "../../erp/_components/solutions-scene";
import { SOLUTION_ICON } from "../../erp/_components/solution-icons";
import { localizedAlternates } from "@/i18n/seo";
import { slug } from "@/i18n/slug";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Meta.solutions");
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/solutions", locale),
    openGraph: { title: t("ogTitle"), description: t("ogDescription"), type: "website" },
  };
}

/** A card's link: the entry's own page, or (when its href is this page's own card) the product behind it. */
const ownPage = (s: Solution) => !s.href.startsWith("/solutions#");
const exploreHref = (s: Solution) => (ownPage(s) ? s.href : hrefFor(s.product));

const AREA_ICON: Record<AreaName, LucideIcon> = {
  Sales: ShoppingCart,
  "Procurement & Stores": Package,
  Production: Cog,
  Quality: ShieldCheck,
  "Dispatch & GST": Receipt,
  People: Users,
  Collaboration: MessageSquare,
  Platform: Layers,
};

/** FAQ questions shown under "Getting started" (the words come from messages/*.json, "Faq"). */
const START_FAQ = LIVE_FAQ.filter((f) =>
  [
    "How long does onboarding take?",
    "Do we have to move our accounts out of Tally?",
    "Does Synax generate e-invoices and e-way bills?",
    "Which machines can Synax connect to?",
    "Is Synax free for small manufacturers?",
  ].includes(f.q),
);
const WHO_Q = "Who is Synax built for?";

/**
 * /solutions — where to start for each solution, how far each reaches, the module directory, then the shared workflow.
 * Structure (icons, order, coverage) comes from the data files; every word comes from messages/*.json:
 * "SolutionsPage", "Solutions", "SolutionGroups", "SolutionPaths", "Modules", "Areas", "Industries", "Workflow", "Faq", "Scene".
 */
export default function SolutionsPage() {
  const t = useTranslations("SolutionsPage");
  const ts = useTranslations("Solutions");
  const tg = useTranslations("SolutionGroups");
  const tp = useTranslations("Products");
  const tpath = useTranslations("SolutionPaths");
  const tm = useTranslations("Modules");
  const ta = useTranslations("Areas");
  const tas = useTranslations("AreasShort");
  const ti = useTranslations("Industries");
  const tw = useTranslations("Workflow");
  const tf = useTranslations("Faq");
  const nav = useTranslations("Nav");

  const mod = (name: string) => tm(slug(name));
  const area = (name: string) => ta(slug(name));
  const areaShort = (name: string) => (tas.has(slug(name)) ? tas(slug(name)) : ta(slug(name)));
  const faqItem = (q: string) => ({ q: tf(`${slug(q)}.q`), a: tf(`${slug(q)}.a`) });
  const exploreLabel = (s: Solution) =>
    s.href.startsWith("/solutions/") ? t("start.seeIndustry") : t("start.seeProduct", { name: tp(`${s.product}.name`) });

  return (
    <main>
      <PageHero
        fit
        foot={
          <div className="hidden md:block">
            <p className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">{t("pickStart")}</p>
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {SOLUTIONS.map((s) => {
                const tone = TONE[s.tone];
                const Icon = SOLUTION_ICON[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={`#start-${s.key}`}
                      className="group flex h-full items-start gap-3 rounded-xl border border-slate-300 bg-surface p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${tone.tile}`}>
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-tight font-bold text-slate-900">{ts(`${s.key}.title`)}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-600">{tpath(`${s.key}.pain`)}</span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-slate-400 transition-colors group-hover:text-accent" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        }
        tourTitle="Synax Platform Overview"
        crumbs={[{ label: nav("solutions") }]}
        tag={t("tag")}
        title={t("title")}
        lead={t("lead")}
        aside={
          <>
            <div className="hidden md:block">
              <SolutionsScene
                areas={AREAS}
                areaLabels={Object.fromEntries(AREAS.map((a) => [a, areaShort(a)]))}
                solutions={SOLUTIONS.map((x) => ({
                  key: x.key,
                  title: ts(`${x.key}.title`),
                  pain: tpath(`${x.key}.pain`),
                  start: SOLUTION_PATHS[x.key].start.map(mod),
                  then: SOLUTION_PATHS[x.key].then.map(mod),
                  coverage: SOLUTION_PATHS[x.key].coverage,
                }))}
              />
            </div>
            <nav aria-label={t("pickStart")} className="rounded-3xl border border-sky-200 bg-surface p-5 shadow-sm sm:p-6 md:hidden">
              <p className="text-sm font-bold text-slate-900">{t("pickStart")}</p>
              <ul className="mt-4 space-y-2">
                {SOLUTIONS.map((s) => {
                  const tone = TONE[s.tone];
                  const Icon = SOLUTION_ICON[s.key];
                  return (
                    <li key={s.key}>
                      <a
                        href={`#start-${s.key}`}
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-3 transition-colors hover:border-sky-300 hover:bg-sky-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${tone.tile}`}>
                          <Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-slate-900">{ts(`${s.key}.title`)}</span>
                          <span className="block text-xs text-slate-600">{tpath(`${s.key}.pain`)}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-slate-400 group-hover:text-accent" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        }
      />

      {/* Start with what hurts most */}
      <section id="start" aria-labelledby="start-heading" className="scroll-mt-24 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>{t("start.tag")}</SectionTag>
            <h2 id="start-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("start.title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t("start.lead")}</p>
          </div>

          <p className="mx-auto mb-8 flex max-w-3xl gap-3 rounded-2xl border border-sky-200 bg-surface p-4 text-sm leading-relaxed text-slate-700 shadow-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="font-bold text-slate-900">{faqItem(WHO_Q).q} </span>
              {faqItem(WHO_Q).a}
            </span>
          </p>

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SOLUTIONS.map((s, i) => {
              const tone = TONE[s.tone];
              const Icon = SOLUTION_ICON[s.key];
              const path = SOLUTION_PATHS[s.key];
              return (
                <Reveal key={s.key} as="li" delay={i * 70} className="flex">
                  <article
                    id={`start-${s.key}`}
                    aria-labelledby={`start-${s.key}-title`}
                    className={`flex w-full scroll-mt-28 flex-col rounded-2xl border border-t-4 border-slate-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 id={`start-${s.key}-title`} className="text-[15px] leading-snug font-bold text-slate-900">
                          {ts(`${s.key}.title`)}
                        </h3>
                        <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{tg(`${s.group}.label`)}</p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">
                      <span className="block text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t("start.whatHurts")}</span>
                      {tpath(`${s.key}.pain`)}
                    </p>

                    <p className="mt-4 text-[11px] font-bold tracking-wider text-brand uppercase">{t("start.startWith")}</p>
                    <ol className="mt-2 space-y-1.5">
                      {path.start.map((m, n) => (
                        <li key={m} className="flex items-center gap-2.5 text-[13px] font-medium text-slate-800">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-solid text-[11px] font-semibold text-white">
                            {n + 1}
                          </span>
                          {mod(m)}
                        </li>
                      ))}
                    </ol>

                    <p className="mt-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">{t("start.thenAdd")}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {path.then.map((m) => (
                        <li
                          key={m}
                          className="flex items-center gap-1 rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-1 text-[11.5px] font-medium text-slate-700"
                        >
                          <Plus className="size-3 text-sky-700" aria-hidden="true" />
                          {mod(m)}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={exploreHref(s)}
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand hover:underline"
                    >
                      {exploreLabel(s)}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How far each solution reaches */}
      <Block id="reach" tag={t("reach.tag")} title={t("reach.title")} lead={t("reach.lead")} tone="white">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">{t("reach.caption")}</caption>
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-600">
                <th scope="col" className="px-4 py-3">{t("reach.solution")}</th>
                {AREAS.map((a) => {
                  const AIcon = AREA_ICON[a];
                  return (
                    <th key={a} scope="col" className="px-2 py-3 text-center">
                      <span className="flex flex-col items-center gap-1">
                        <AIcon className="size-4 text-brand" aria-hidden="true" />
                        <span className="leading-tight">{area(a)}</span>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SOLUTIONS.map((s) => {
                const tone = TONE[s.tone];
                const Icon = SOLUTION_ICON[s.key];
                const cov = SOLUTION_PATHS[s.key].coverage;
                return (
                  <tr key={s.key}>
                    <th scope="row" className="px-4 py-3.5 font-bold text-slate-900">
                      <span className="flex items-center gap-2.5">
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${tone.tile}`}>
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        {ts(`${s.key}.title`)}
                      </span>
                    </th>
                    {AREAS.map((a) => (
                      <td key={a} className="px-2 py-3.5 text-center">
                        {cov[a] === 2 ? (
                          <span className="mx-auto block size-3.5 rounded-full bg-brand-solid">
                            <span className="sr-only">{t("reach.core")}</span>
                          </span>
                        ) : cov[a] === 1 ? (
                          <span className="mx-auto block size-3.5 rounded-full border-2 border-brand-line bg-surface">
                            <span className="sr-only">{t("reach.optional")}</span>
                          </span>
                        ) : (
                          <span className="mx-auto block h-0.5 w-3 rounded bg-slate-300">
                            <span className="sr-only">{t("reach.notTypical")}</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600" aria-label={t("reach.legendAria")}>
          <li className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-brand-solid" aria-hidden="true" /> {t("reach.legendCore")}</li>
          <li className="flex items-center gap-2"><span className="size-3.5 rounded-full border-2 border-brand-line bg-surface" aria-hidden="true" /> {t("reach.legendOptional")}</li>
          <li className="flex items-center gap-2"><span className="h-0.5 w-3 rounded bg-slate-300" aria-hidden="true" /> {t("reach.legendNot")}</li>
        </ul>
      </Block>

      {/* Module directory (portal) */}
      <Block id="modules" tag={t("modules.tag")} title={t("modules.title")} lead={t("modules.lead")}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_MODULES.map((m) => {
            const areaName = m.area as AreaName;
            const AIcon = AREA_ICON[areaName] ?? Layers;
            const users = SOLUTIONS.filter((s) => SOLUTION_PATHS[s.key].coverage[areaName] === 2);
            return (
              <li key={m.area} className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-brand">
                    <AIcon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-[15px] font-bold text-slate-900">{area(m.area)}</h3>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5 text-[13px] text-slate-700">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                      {mod(item)}
                    </li>
                  ))}
                </ul>
                {users.length > 0 ? (
                  <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-snug text-slate-500">
                    {t("modules.coreTo", { list: users.map((u) => ts(`${u.key}.title`)).join(", ") })}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-center text-sm text-slate-600">
          {t.rich("modules.notListed", {
            link: (chunks) => (
              <Link href="/products" className="font-semibold text-brand hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </Block>

      {/* Industry pages */}
      <Block id="industries" tag={t("pages.tag")} title={t("pages.title")} lead={t("pages.lead")} tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTION_GROUPS.flatMap((g) => INDUSTRY_PAGES.filter((p) => p.group === g.id)).map((i) => {
            const tone = TONE[i.tone];
            const IIcon = INDUSTRY_ICON[i.icon];
            return (
              <li key={i.slug}>
                <Link
                  href={industryHref(i.slug)}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                    <IIcon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{tg(`${i.group}.label`)}</span>
                    <span className="block text-sm font-bold text-slate-900">{ti(`${i.slug}.name`)}</span>
                    <span className="block text-xs text-slate-500">{ti(`${i.slug}.menu`)}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Shared workflow */}
      <Block id="workflow" tag={t("workflow.tag")} title={t("workflow.title")} lead={t("workflow.lead")}>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage) => (
            <li key={stage.id} className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">
                {stage.step}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{tw(`${stage.id}.title`)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tw(`${stage.id}.copy`)}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t("workflow.modulesAria", { title: tw(`${stage.id}.title`) })}>
                {stage.modules.map((m) => (
                  <li key={m} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                    {mod(m)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      {/* Getting started (portal FAQ) */}
      <Block id="faq" tag={t("faq.tag")} title={t("faq.title")} lead={t("faq.lead")} tone="white">
        <Faq items={START_FAQ.map((f) => faqItem(f.q))} />
      </Block>

      <CtaBand tone="light" tourTitle="Synax Platform Overview" title={t("cta.title")} text={t("cta.text")} />
    </main>
  );
}
