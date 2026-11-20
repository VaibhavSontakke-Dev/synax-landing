"use client";

import { ArrowRight, ArrowUp, Award, CheckCircle2, Globe, Lock, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDemo } from "./demo-provider";
import { hrefFor, type ProductKey } from "../_data/products";
import { SOLUTIONS, type SolutionGroup } from "../_data/solutions";

/**
 * Site footer (dark navy), the same on every page. From top to bottom:
 *
 *  - a demo band: one line on what the demo is, with Schedule a demo and Contact sales;
 *  - the main block: brand column (logo, tagline, intro, address, website) and four link columns of equal
 *    weight: Products, Industries, Operations (the "how you manufacture" and "business needs" solutions) and
 *    Company;
 *  - a compliance strip (the four alignment badges in one row);
 *  - the legal bar with back-to-top.
 *
 * A faint "SYNAX" watermark runs along the bottom. Everything is real navigation inside labelled <nav>s; the
 * columns stack on phones.
 */

// Same destinations and order as the header's Products menu. Names come from messages/*.json ("Products.<key>.name").
const PRODUCTS: ProductKey[] = ["precision", "it", "hrms", "staffing", "shopfloor", "ai"];

/** Solution groups shown in the Industries and Operations columns. */
const INDUSTRY_GROUPS: SolutionGroup[] = ["industry"];
const OPERATION_GROUPS: SolutionGroup[] = ["process", "need"];

/** `key` is a message key under "Footer.compliance". */
const COMPLIANCE = [
  { Icon: ShieldCheck, key: "as9100d" },
  { Icon: CheckCircle2, key: "gst" },
  { Icon: Award, key: "tally" },
  { Icon: Lock, key: "dpdp" },
] as const;

/** A fixed year: new Date() cannot be read while prerendering a client component. Update each January. */
const COPYRIGHT_YEAR = 2026;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300";

const linkClass = `inline-block rounded-sm text-sm text-slate-300 transition-colors duration-200 hover:text-orange-300 ${FOCUS}`;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-bold tracking-[0.14em] text-white uppercase">
      {children}
      <span className="mt-2 block h-0.5 w-6 rounded-full bg-orange-300" aria-hidden="true" />
    </h3>
  );
}

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const tp = useTranslations("Products");
  const ts = useTranslations("Solutions");
  const shared = useTranslations("Shared");
  const { openDemo } = useDemo();
  const onScheduleDemo = () => openDemo();

  /** The solutions of the given groups, with the shorter footer name where one exists. */
  const solutionLinks = (groups: SolutionGroup[]) =>
    SOLUTIONS.filter((s) => groups.includes(s.group)).map((s) => (
      <li key={s.key}>
        <Link href={s.href} className={linkClass}>
          {ts.has(`${s.key}.footer`) ? ts(`${s.key}.footer`) : ts(`${s.key}.title`)}
        </Link>
      </li>
    ));

  return (
    <footer className="keep-light-palette relative isolate overflow-hidden bg-blue-950 text-slate-300">
      {/* Decorative: top accent line, glows, big faint wordmark */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-300 via-orange-300/40 to-transparent" />
        <div className="absolute -top-28 right-0 size-80 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 size-96 rounded-full bg-blue-600/20 blur-3xl" />
        <p className="absolute right-0 -bottom-10 left-0 text-center text-[clamp(6rem,20vw,16rem)] leading-none font-black tracking-tighter text-white/[0.03] select-none">
          SYNAX
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Demo band */}
        <div className="flex flex-col gap-5 border-b border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white sm:text-xl">{t("ctaTitle")}</p>
            <p className="mt-1 text-sm text-slate-400">{t("ctaBody")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={onScheduleDemo}
              className={`flex cursor-pointer items-center gap-2 rounded-md bg-orange-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-300 ${FOCUS}`}
            >
              {nav("scheduleDemo")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onScheduleDemo}
              className={`cursor-pointer rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-orange-300 hover:text-orange-300 ${FOCUS}`}
            >
              {t("contactSales")}
            </button>
          </div>
        </div>

        {/* Main block: brand column and four link columns */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] lg:gap-x-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={nav("homeAria")} className={`inline-block rounded-lg ${FOCUS}`}>
              <Image src="/images/synax-pro-light.webp" alt="" width={480} height={132} sizes="117px" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-orange-300">{t("tagline")}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{t("introShort")}</p>

            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden="true" />
                <address className="leading-relaxed text-slate-300 not-italic">
                  Gera&apos;s Imperium Alpha, Near EON IT Park,
                  <br />
                  Kharadi, Pune, Maharashtra, India-411014.
                </address>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="size-4 shrink-0 text-sky-300" aria-hidden="true" />
                <a href="https://synax.senwellgroup.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  synax.senwellgroup.com
                  <span className="sr-only">{shared("opensNewTab")}</span>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={t("productsAria")}>
            <ColumnHeading>{t("products")}</ColumnHeading>
            <ul className="space-y-2.5">
              {PRODUCTS.map((key) => (
                <li key={key}>
                  <Link href={hrefFor(key)} className={linkClass}>
                    {tp(`${key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("industries")}>
            <ColumnHeading>{t("industries")}</ColumnHeading>
            <ul className="space-y-2.5">
              {solutionLinks(INDUSTRY_GROUPS)}
              <li>
                <Link href="/solutions" className={`${linkClass} font-semibold text-orange-300 hover:text-orange-200`}>
                  {t("allSolutions")} &rarr;
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t("operations")}>
            <ColumnHeading>{t("operations")}</ColumnHeading>
            <ul className="space-y-2.5">{solutionLinks(OPERATION_GROUPS)}</ul>
          </nav>

          <nav aria-label={t("companyAria")}>
            <ColumnHeading>{t("company")}</ColumnHeading>
            <ul className="space-y-2.5">
              <li>
                <Link href="/why-synax" className={linkClass}>
                  {nav("whySynax")}
                </Link>
              </li>
              <li>
                <Link href="/security" className={linkClass}>
                  {nav("security")}
                </Link>
              </li>
              <li>
                <Link href="/products" className={linkClass}>
                  {t("compareProducts")}
                </Link>
              </li>
              <li>
                <button type="button" onClick={onScheduleDemo} className={`${linkClass} cursor-pointer text-left`}>
                  {t("contactSales")}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Compliance strip */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 sm:flex-row sm:items-center">
          <p className="shrink-0 text-xs font-semibold text-slate-500">{t("complianceHeading")}</p>
          <ul className="flex flex-wrap gap-2">
            {COMPLIANCE.map(({ Icon, key }) => (
              <li
                key={key}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                <Icon className="size-3.5 text-orange-300" aria-hidden="true" />
                {t(`compliance.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 pb-24 text-xs text-slate-400 sm:flex-row lg:pb-6">
          <p>{t("copyright", { year: COPYRIGHT_YEAR })}</p>
          <nav aria-label={t("legalAria")} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}>
              {t("privacy")}
            </Link>
            <Link href="/terms" className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}>
              {t("terms")}
            </Link>
            <Link href="/security" className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}>
              {t("security")}
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border border-orange-300/40 bg-white/5 px-3 py-1.5 font-semibold text-slate-100 transition-colors hover:border-orange-300 hover:bg-orange-300/10 hover:text-orange-300 ${FOCUS}`}
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              {t("backToTop")}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
