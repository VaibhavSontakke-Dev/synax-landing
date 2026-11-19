"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUp,
  ArrowUpRight,
  Award,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Factory,
  Globe,
  Lock,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDemo } from "./demo-provider";
import { hrefFor, type ProductKey } from "../_data/products";
import { SOLUTIONS, type SolutionGroup } from "../_data/solutions";

/**
 * Site footer (dark navy), the same on every page. It is as tall as the screen under the header, so the space is
 * used rather than left empty:
 *
 *  - left (4 of 12 columns): white Synax PRO logo, positioning line, contact and the compliance chips;
 *  - right (8 of 12): the six products as small cards (icon, name, one line of what it covers), then three link
 *    columns: Platform, Industries (the five industry pages) and Senwell Group;
 *  - bottom: the legal bar with back-to-top.
 *
 * The content block is centred between the top and the legal bar. A faint "SYNAX" watermark runs along the
 * bottom. Everything is real navigation inside labelled <nav>s; on phones it stacks in one column.
 */

interface FooterProduct {
  Icon: LucideIcon;
  key: ProductKey;
}

// Same destinations as the header's Products menu; the one-line description is the menu's own (`route.menu`).
// The names come from messages/*.json ("Products.<key>.name"), the same ones the home hero uses.
const PRODUCTS: FooterProduct[] = [
  { Icon: Factory, key: "precision" },
  { Icon: Briefcase, key: "it" },
  { Icon: Building2, key: "hrms" },
  { Icon: Users, key: "staffing" },
  { Icon: Activity, key: "shopfloor" },
  { Icon: Bot, key: "ai" },
];

/** `nav` is a message key under "Nav" (a name that is the same in every language, like "Synax AI", uses `name`). */
const PLATFORM_LINKS: { nav?: "whySynax" | "security"; name?: string; href: string }[] = [
  { nav: "whySynax", href: "/why-synax" },
  { name: "Synax AI", href: hrefFor("ai") },
  { nav: "security", href: "/security" },
];

/** The Solutions column is split like the header menu: industries on the left, the other two lenses on the right. */
const SOLUTION_COLUMNS: SolutionGroup[][] = [["industry"], ["process", "need"]];

const GROUP_LINKS = [
  { label: "Senwell Exports", href: "https://senwellexports.com/" },
  { label: "Stacwell", href: "https://stacwell.com/" },
  { label: "Stacem", href: "https://www.stacem.com/" },
];

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

const linkClass = `inline-block rounded-sm text-sm text-slate-300 transition-all duration-200 hover:translate-x-0.5 hover:text-orange-300 ${FOCUS}`;

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
  const tg = useTranslations("SolutionGroups");
  const live = useTranslations("Live");
  const shared = useTranslations("Shared");
  const { openDemo } = useDemo();
  const onScheduleDemo = () => openDemo();

  return (
    <footer className="keep-light-palette relative isolate flex min-h-[calc(100svh-4.1rem)] flex-col overflow-hidden bg-blue-950 text-slate-300">
      {/* Decorative: top accent line, glows, fine dot grid, big faint wordmark */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-300 via-orange-300/40 to-transparent" />
        <div className="absolute -top-28 right-0 size-80 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 size-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]" />
        <p className="absolute right-0 -bottom-10 left-0 text-center text-[clamp(6rem,20vw,16rem)] leading-none font-black tracking-tighter text-white/[0.035] select-none">
          SYNAX
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-12 pb-24 sm:px-6 lg:px-8 lg:pt-8 lg:pb-5">
        {/* Content block, centred between the top and the legal bar */}
        <div className="my-auto grid gap-10 py-2 lg:grid-cols-12 lg:gap-x-12">
          {/* Brand, contact, demo, compliance */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label={nav("homeAria")} className={`relative inline-block rounded-lg ${FOCUS}`}>
              <span className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-full bg-blue-500/20 blur-2xl" aria-hidden="true" />
              <Image src="/images/synax-pro-light.webp" alt="" width={480} height={132} sizes="117px" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-orange-300">{live("positioning.headline")}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300">
              {t.rich("intro", {
                // "Senwell Group" opens the group company's site (the same address as the "Senwell Exports" link in the Senwell Group column).
                link: (chunks) => (
                  <a
                    href="https://senwellexports.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-sm font-semibold text-white underline decoration-white/30 underline-offset-2 transition-colors hover:text-orange-300 hover:decoration-orange-300 ${FOCUS}`}
                  >
                    {chunks}
                    <span className="sr-only">{shared("opensNewTab")}</span>
                  </a>
                ),
              })}
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-200">
                  <Globe className="size-4" aria-hidden="true" />
                </span>
                <a href="https://synax.senwellgroup.com" target="_blank" rel="noopener noreferrer" className={`${linkClass} hover:translate-x-0`}>
                  synax.senwellgroup.com
                  <span className="sr-only">{shared("opensNewTab")}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-200">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <address className="text-slate-300 not-italic leading-relaxed">
                  Gera&apos;s Imperium Alpha, Near EON IT Park,
                  <br />
                  Kharadi, Pune, Maharashtra, India-411014.
                </address>
              </li>
            </ul>

            <div className="mt-5">
              <p className="mb-2.5 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">{t("complianceHeading")}</p>
              <ul className="flex flex-wrap gap-2">
                {COMPLIANCE.map(({ Icon, key }) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm"
                  >
                    <Icon className="size-3.5 text-orange-300" aria-hidden="true" />
                    {t(`compliance.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Products as cards, then the link columns */}
          <div className="lg:col-span-8">
            <nav aria-label={t("productsAria")}>
              <ColumnHeading>{t("products")}</ColumnHeading>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {PRODUCTS.map((p) => (
                  <li key={p.key}>
                    <Link
                      href={hrefFor(p.key)}
                      className={`group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors hover:border-orange-300/50 hover:bg-white/[0.08] ${FOCUS}`}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sky-200 transition-colors group-hover:border-orange-300/50 group-hover:bg-orange-300/10 group-hover:text-orange-300">
                        <p.Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug font-semibold text-white transition-colors group-hover:text-orange-300">{tp(`${p.key}.name`)}</span>
                        <span className="mt-0.5 block truncate text-xs leading-snug text-slate-400" title={tp(`${p.key}.menu`)}>{tp(`${p.key}.menu`)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)_minmax(0,1fr)]">
              <nav aria-label={t("platform")}>
                <ColumnHeading>{t("platform")}</ColumnHeading>
                <ul className="space-y-2.5">
                  {PLATFORM_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.nav ? nav(l.nav) : l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label={t("solutions")} className="sm:order-last sm:col-span-2 lg:order-none lg:col-span-1">
                <div className="flex items-start justify-between gap-4">
                  <ColumnHeading>{t("solutions")}</ColumnHeading>
                  <Link
                    href="/solutions"
                    className={`rounded-sm text-xs font-semibold whitespace-nowrap text-orange-300 transition-colors hover:text-orange-200 ${FOCUS}`}
                  >
                    {t("allSolutions")} &rarr;
                  </Link>
                </div>
                <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {SOLUTION_COLUMNS.map((groups, c) => (
                    <div key={c} className="space-y-3">
                      {groups.map((id) => (
                        <div key={id}>
                          <p className="mb-1.5 text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
                            {tg(`${id}.label`)}
                          </p>
                          <ul className="space-y-2">
                            {SOLUTIONS.filter((s) => s.group === id).map((s) => (
                              <li key={s.key}>
                                <Link href={s.href} className={linkClass}>
                                  {/* A shorter name where one exists, so the solutions fit their half-columns on one line. */}
                                  {ts.has(`${s.key}.footer`) ? ts(`${s.key}.footer`) : ts(`${s.key}.title`)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </nav>

              <nav aria-label={t("companyAria")}>
                <ColumnHeading>Senwell Group</ColumnHeading>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/#senwell" className={linkClass}>
                      {t("aboutSenwell")}
                    </Link>
                  </li>
                  {GROUP_LINKS.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                        {l.label}
                        <ArrowUpRight className="size-3.5 text-slate-500" aria-hidden="true" />
                        <span className="sr-only">{shared("opensNewTab")}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <button type="button" onClick={onScheduleDemo} className={`${linkClass} cursor-pointer text-left font-semibold text-white`}>
                      {t("contactSales")}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row">
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
