import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Users } from "lucide-react";
import { PRODUCT_DATA, hrefFor } from "../_data/products";
import { WORKFLOW_STAGES } from "../_data/content";
import { industryBySlug, tourTitleOf, type IndustryPage } from "../_data/industries";
import { Breadcrumb } from "./site-page";
import { SectionTag } from "./section-tag";
import { TourButton } from "./demo-buttons";
import { Reveal } from "./reveal";

/**
 * One hero per industry page, each with its own composition (they are meant to look different from each
 * other and from the product pages):
 *   aerospace-defence            "Flight deck"  full-bleed sky photo, corner brackets, a glass gate bar
 *   precision-cnc-machining      "Drawing"      split screen, diagonal-cut spindle photo with callouts
 *   it-services-staffing         "Pipeline"     centred headline over a requirement-to-billing board
 *   (any other page)             "Poster"       oversized type on the page's heroImage, a six-step line
 *                                              (industrial-machinery-equipment, oil-gas-energy)
 *   plant-workforce-hcm          "Roster"       copy beside one card with a plant-floor photo header
 * Copy and flow steps come from `_data/industries.ts`; the small numbers and names inside the mock cards and
 * boards are samples and say so. Photos are the files in /public/images. Server components.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

/** Where the coloured part of the headline starts. A translated page carries the two parts itself. */
function splitTitle(page: IndustryPage) {
  if (page.titleHead !== undefined) return { head: page.titleHead, tail: page.titleTail ?? "" };
  const cut = page.title.indexOf(" for ");
  return cut > 0 ? { head: page.title.slice(0, cut + 5), tail: page.title.slice(cut + 5) } : { head: page.title, tail: "" };
}

function DarkCrumbs({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  const ts = useTranslations("Shared");
  return (
    <nav aria-label={ts("breadcrumb")} className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
      <Link href="/" className="hover:text-white hover:underline">
        {t("crumbHome")}
      </Link>
      <ChevronRight className="size-3.5" aria-hidden="true" />
      <Link href="/solutions" className="hover:text-white hover:underline">
        {t("crumbSolutions")}
      </Link>
      <ChevronRight className="size-3.5" aria-hidden="true" />
      <span aria-current="page" className="font-semibold text-white">
        {page.name}
      </span>
    </nav>
  );
}

function LightCrumbs({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  return <Breadcrumb items={[{ label: t("crumbSolutions"), href: "/solutions" }, { label: page.name }]} />;
}

/* -------------------------------------------------------------------------- */
/* 1 · Aerospace & Defence — "Flight deck"                                    */
/* -------------------------------------------------------------------------- */

function FlightDeckHero({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  const ta = useTranslations("Industries.aerospace-defence");
  const { head, tail } = splitTitle(page);
  // The quality gate is the "inspect" step, found by id so it works in every language.
  const found = WORKFLOW_STAGES.findIndex((s) => s.id === "inspect");
  const gate = found >= 0 ? found : 0;
  const bracket = "absolute hidden size-6 border-orange-300 sm:block";
  return (
    <section aria-labelledby="page-heading" className="keep-light-palette relative isolate overflow-hidden bg-blue-950 text-white">
      <Image
        src="/images/aerospace.webp"
        alt={ta("heroAlt")}
        fill
        priority
        sizes="100vw"
        quality={75}
        className="-z-20 object-cover object-[70%_50%]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-blue-950/80 lg:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-blue-950/95 via-blue-950/60 to-blue-950/5 lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-blue-950/80 to-transparent" />
        <span className={`${bracket} top-4 left-4 border-t-2 border-l-2`} />
        <span className={`${bracket} top-4 right-4 border-t-2 border-r-2`} />
        <span className={`${bracket} bottom-4 left-4 border-b-2 border-l-2`} />
        <span className={`${bracket} right-4 bottom-4 border-r-2 border-b-2`} />
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-between gap-12 px-4 pt-8 pb-8 sm:px-6 lg:px-8 lg:pt-10">
        <div>
          <DarkCrumbs page={page} />
          <div className="max-w-xl">
            <SectionTag tone="dark" lines="start">
              {page.tag}
            </SectionTag>
            <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {head}
              {tail ? <span className="text-sky-200">{tail}</span> : null}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-slate-200 sm:text-base">{page.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TourButton title={tourTitleOf(page.slug)} onDark />
            </div>
          </div>
        </div>

        <ol aria-label={t("gatesAria")} className="grid grid-cols-2 gap-2 rounded-2xl border border-white/25 bg-white/10 p-2.5 backdrop-blur-md sm:grid-cols-4">
          {page.flow.map((s, i) => {
            const on = i === gate;
            return (
              <li
                key={s.title}
                className={`rounded-xl px-3.5 py-2.5 transition-colors ${on ? "bg-orange-300 text-blue-950" : "text-slate-100 hover:bg-white/10"}`}
              >
                <p className="font-mono text-[11px] font-semibold opacity-70">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-sm font-bold">{s.title}</p>
                {s.chips?.[0] ? <p className={`truncate text-[11px] ${on ? "text-brand" : "text-slate-300"}`}>{s.chips[0]}</p> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 · Precision CNC — "Drawing"                                              */
/* -------------------------------------------------------------------------- */

/** `id` is the message key under "Industries.precision-cnc-machining.callouts". */
const DRAWING_CALLOUTS = [
  { id: "c1", x: 70, y: 14, tone: "white" },
  { id: "c2", x: 66, y: 86, tone: "white" },
  { id: "c3", x: 24, y: 80, tone: "white" },
  { id: "c4", x: 30, y: 8, tone: "orange" },
] as const;

function DrawingHero({ page }: { page: IndustryPage }) {
  const tc = useTranslations("Industries.precision-cnc-machining.callouts");
  const ta = useTranslations("Industries.precision-cnc-machining");
  const { head, tail } = splitTitle(page);
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-50">
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_right,#000,transparent_60%)]" aria-hidden="true" />

      {/* Photo panel, cut on a diagonal (large screens) */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[58%] bg-brand-solid lg:block"
        style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden="true"
      >
        <Image
          src="/images/precision.webp"
          alt=""
          fill
          sizes="60vw"
          quality={75}
          className="object-cover object-[55%_50%]"
        />
        <div className="absolute inset-0 bg-blue-950/35" />
        <svg className="absolute inset-0 size-full" aria-hidden="true">
          {DRAWING_CALLOUTS.map((c) => (
            <line key={c.id} x1={`${c.x}%`} y1={`${c.y}%`} x2="52%" y2="56%" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          ))}
          <circle cx="52%" cy="56%" r="6" fill="#fdba74" stroke="#fff" strokeWidth="2" />
        </svg>
        {DRAWING_CALLOUTS.map((c) => (
          <span
            key={c.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-md ${
              c.tone === "orange" ? "bg-orange-300 text-blue-950" : "bg-surface text-brand"
            }`}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            {tc(c.id)}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-14">
        <LightCrumbs page={page} />
        <div className="max-w-xl py-2 lg:min-h-[26rem] lg:max-w-[34rem] lg:py-8">
          <SectionTag lines="start">{page.tag}</SectionTag>
          <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {head}
            {tail ? <span className="text-brand">{tail}</span> : null}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-700 sm:text-base">{page.lead}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TourButton title={tourTitleOf(page.slug)} />
          </div>
        </div>

        {/* Small screens: the photo sits below the copy with the callouts as chips */}
        <div className="mt-6 lg:hidden">
          <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-200 bg-brand-solid">
            <Image src="/images/precision.webp" alt={ta("heroAlt")} fill sizes="100vw" quality={70} className="object-cover" />
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {DRAWING_CALLOUTS.map((c) => (
              <li key={c.id} className="rounded-md border border-slate-200 bg-surface px-2.5 py-1 text-xs font-semibold text-brand">
                {tc(c.id)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3 · IT Services & Staffing — "Pipeline"                                    */
/* -------------------------------------------------------------------------- */

function PipelineHero({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  const ts = useTranslations("Industries.it-services-staffing.samples");
  const { head, tail } = splitTitle(page);
  const last = page.flow.length - 1;
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page">
      {/* Device photo as a soft accent on the right edge */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-40 [mask-image:linear-gradient(to_right,transparent,#000_65%)] lg:block"
        aria-hidden="true"
      >
        <Image src="/images/modern-ui-v2.webp" alt="" fill sizes="50vw" quality={70} className="object-cover object-[50%_35%]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-10 lg:pb-14">
        <LightCrumbs page={page} />
        <div className="mx-auto max-w-3xl text-center">
          <SectionTag lines="both">{page.tag}</SectionTag>
          <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {head}
            {tail ? <span className="text-brand">{tail}</span> : null}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">{page.lead}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TourButton title={tourTitleOf(page.slug)} />
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-2 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">{page.flowTitle}</p>
          <ol className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {page.flow.map((s, i) => {
              const end = i === last;
              return (
                <Reveal key={s.title} as="li" delay={i * 60} className="flex">
                  <div
                    className={`relative flex w-full flex-col rounded-xl border p-3.5 shadow-sm ${
                      end ? "keep-light-palette border-brand-line bg-brand-solid text-white" : "border-slate-200 bg-surface text-slate-900"
                    }`}
                  >
                    <p className={`font-mono text-[11px] font-semibold ${end ? "text-sky-200" : "text-brand/60"}`}>{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-1 text-sm leading-snug font-bold">{s.title}</p>
                    <p className={`mt-2.5 rounded-md px-2 py-1 text-[11px] font-medium ${end ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"}`}>
                      {i < 6 ? ts(`s${i + 1}`) : t("inProgress")}
                    </p>
                    {i < last ? (
                      <ChevronRight className="absolute top-1/2 -right-2.5 z-10 hidden size-4 -translate-y-1/2 rounded-full bg-surface text-brand shadow lg:block" aria-hidden="true" />
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </ol>
          <p className="mt-2 text-center text-[11px] text-slate-500">{t("sample")}</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4 · Machinery, Oil & Gas (and any page without its own) — "Poster"         */
/* -------------------------------------------------------------------------- */

function PosterHero({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  const locale = useLocale();
  const { head, tail } = splitTitle(page);
  const active = Math.min(3, page.flow.length - 1);
  return (
    <section aria-labelledby="page-heading" className="keep-light-palette relative isolate overflow-hidden bg-blue-950 text-white">
      <Image
        src={page.heroImage?.src ?? "/images/robot-floor.webp"}
        alt={page.heroImage?.alt ?? "Industrial robot arms on a factory floor"}
        fill
        priority
        sizes="100vw"
        quality={75}
        className="-z-20 object-cover object-[60%_40%]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/55 via-blue-950/75 to-blue-950/95" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(148,163,184,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 lg:px-8 lg:pt-10 lg:pb-10">
        <DarkCrumbs page={page} />

        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="relative pl-5 sm:pl-7">
            <span className="absolute top-1 bottom-1 left-0 w-1.5 rounded-full bg-orange-300" aria-hidden="true" />
            <SectionTag tone="dark" lines="start">
              {page.tag}
            </SectionTag>
            <h1 id="page-heading" className="mt-3 max-w-3xl text-4xl leading-[1.05] font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {head}
              {tail ? <span className="text-sky-200">{tail}</span> : null}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">{page.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TourButton title={tourTitleOf(page.slug)} onDark />
            </div>
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-7xl leading-none font-black tracking-tight text-white">{page.flow.length}</p>
            <p className="mt-1 text-sm text-slate-300">{t("stepsLine", { title: locale === "de" ? page.flowTitle : page.flowTitle.toLowerCase() })}</p>
          </div>
        </div>

        {/* The production line */}
        <ol className="relative mt-12 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-6" aria-label={t("flowAria")}>
          <span className="absolute top-[0.4375rem] right-[8.3%] left-[8.3%] hidden h-0.5 bg-white/25 sm:block" aria-hidden="true" />
          <span className="synax-prod-dash-x absolute top-[0.4375rem] right-[8.3%] left-[8.3%] hidden h-0.5 text-orange-300/70 sm:block" aria-hidden="true" />
          {page.flow.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.title} className="relative flex flex-col items-center text-center">
                <span
                  className={`relative z-10 block size-4 rounded-full border-2 border-surface ${on ? "synax-prod-pulse bg-orange-300" : i < active ? "bg-surface" : "bg-white/30"}`}
                  aria-hidden="true"
                />
                <span className="mt-2.5 text-xs leading-snug font-semibold text-slate-100">{s.title}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5 · Plant Workforce & HCM — "Roster"                                       */
/* -------------------------------------------------------------------------- */

/** 0 = absent, 1 = present, 2 = on approved leave or half day (a lighter navy). */
const ROSTER = [
  { n: 1, days: [1, 1, 1, 2, 0] },
  { n: 2, days: [1, 2, 1, 1, 0] },
  { n: 3, days: [1, 1, 2, 1, 1] },
];
const DAY_STYLE = ["bg-slate-200", "bg-brand-solid", "bg-blue-900/35"];
/** Message keys under "Industries.plant-workforce-hcm.roster". */
const DAY_LABEL = ["absent", "present", "leave"] as const;

function RosterHero({ page }: { page: IndustryPage }) {
  const t = useTranslations("SolutionPage.hero");
  const tr = useTranslations("Industries.plant-workforce-hcm.roster");
  const { head, tail } = splitTitle(page);
  // Found in the English flow (by its words), then taken from the translated one at the same position.
  const english = industryBySlug(page.slug)?.flow ?? [];
  const overtime = page.flow[english.findIndex((s) => /overtime/i.test(s.title))];
  const payroll = page.flow[english.findIndex((s) => /payroll/i.test(s.title))];
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 [background-image:radial-gradient(var(--grid-line)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-orange-200/30 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-14">
        <LightCrumbs page={page} />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <SectionTag lines="start">{page.tag}</SectionTag>
            <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {head}
              {tail ? <span className="text-brand">{tail}</span> : null}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">{page.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TourButton title={tourTitleOf(page.slug)} />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-300 bg-surface shadow-lg">
            <div className="relative h-36 bg-brand-solid sm:h-40">
              <Image
                src="/images/robot-floor.webp"
                alt={tr("alt")}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                quality={75}
                className="object-cover object-[65%_50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/30 to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{page.flowTitle}</p>
              <span className="absolute right-4 bottom-3 rounded-full bg-orange-300 px-2.5 py-0.5 text-[11px] font-bold text-blue-950">{tr("breakPass")}</span>
            </div>
            <div className="p-4 sm:p-5">
              <ul className="space-y-2" aria-label={tr("aria")}>
                {ROSTER.map((r) => (
                  <li key={r.n} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-slate-700">{tr("operator", { n: r.n })}</span>
                    <span className="grid flex-1 grid-cols-5 gap-1.5">
                      {r.days.map((d, i) => (
                        <span key={i} className={`h-5 rounded ${DAY_STYLE[d]}`} title={tr(DAY_LABEL[d])}>
                          <span className="sr-only">{tr(DAY_LABEL[d])}</span>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-sm">
                {overtime ? (
                  <p className="flex items-center justify-between gap-3 text-slate-700">
                    <span>{overtime.title}</span>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{tr("pending", { n: 2 })}</span>
                  </p>
                ) : null}
                {payroll ? (
                  <p className="flex items-center justify-between gap-3 text-slate-700">
                    <span>{payroll.title}</span>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{tr("ready")}</span>
                  </p>
                ) : null}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">{t("sample")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function IndustryHero({ page }: { page: IndustryPage }) {
  switch (page.slug) {
    case "aerospace-defence":
      return <FlightDeckHero page={page} />;
    case "precision-cnc-machining":
      return <DrawingHero page={page} />;
    case "it-services-staffing":
      return <PipelineHero page={page} />;
    case "plant-workforce-hcm":
      return <RosterHero page={page} />;
    default:
      return <PosterHero page={page} />;
  }
}

/** Band under every hero: who it is for, the products that deliver it (each with its icon), and four counts. */
export function HeroFoot({ page, stats }: { page: IndustryPage; stats: { value: number; label: string }[] }) {
  const t = useTranslations("SolutionPage.hero");
  const tpr = useTranslations("Products");
  return (
    <section aria-label={t("glanceAria")} className="border-b border-slate-200 bg-gradient-to-b from-page to-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 divide-y divide-slate-200 lg:grid-cols-[1fr_1.15fr_auto] lg:divide-x lg:divide-y-0">
          {/* Built for */}
          <div className="flex items-start gap-4 py-6 lg:pr-8">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-surface text-brand shadow-xs">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] text-accent uppercase">{t("builtFor")}</p>
              <p className="mt-1 text-sm leading-relaxed font-medium text-slate-800">{page.whoFor}</p>
            </div>
          </div>

          {/* Delivered by */}
          <div className="py-6 lg:px-8">
            <p className="text-[11px] font-bold tracking-[0.14em] text-accent uppercase">{t("deliveredBy")}</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {page.products.map((key, i) => {
                const PIcon = PRODUCT_DATA[key].icon;
                return (
                  <li key={key}>
                    <Link
                      href={hrefFor(key)}
                      className={`group flex items-center gap-2 rounded-xl border bg-surface py-1.5 pr-3 pl-1.5 text-xs font-semibold shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-line hover:shadow-md ${FOCUS} ${
                        i === 0 ? "border-brand-line/40 text-brand" : "border-slate-300 text-slate-800"
                      }`}
                    >
                      <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-brand transition-colors group-hover:bg-brand-solid group-hover:text-white">
                        <PIcon className="size-4" aria-hidden="true" />
                      </span>
                      {tpr(`${key}.name`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Counts */}
          <ul className="grid grid-cols-4 gap-2 py-6 lg:gap-0 lg:pl-8" aria-label={t("countsAria")}>
            {stats.map((s, i) => (
              <Reveal key={s.label} as="li" delay={i * 60}>
                <div className="px-1 text-center lg:min-w-24 lg:border-l lg:border-slate-200 lg:first:border-l-0">
                  <p className="text-3xl leading-none font-extrabold tracking-tight text-brand sm:text-4xl">{s.value}</p>
                  <p className="mt-1.5 text-[11px] leading-tight font-semibold tracking-wide text-slate-500 uppercase">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
