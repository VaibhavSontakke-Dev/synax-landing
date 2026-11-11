"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Factory,
  Lock,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SectionTag } from "./section-tag";
import { useDemo } from "./demo-provider";
import { hrefFor, type ProductKey } from "../_data/products";

/**
 * Landing-page footer.
 *
 * Layout: closing CTA card → 12-col link grid (brand · six products · platform ·
 * company) → compliance chips → legal bar with back-to-top. Everything is real
 * navigation (links/buttons inside labelled <nav>s) and uses the same navy/orange
 * palette and product icon tiles as the header menu and the hero.
 */

interface FooterProduct {
  label: string;
  Icon: LucideIcon;
  /** Dark-surface variant of the colours the Products menu uses for this product. */
  tile: string;
  key: ProductKey;
}

// Same destinations as the header's Products menu.
const PRODUCTS: FooterProduct[] = [
  { label: "Manufacturing ERP", Icon: Factory, tile: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20", key: "precision" },
  { label: "IT Services & Project ERP", Icon: Briefcase, tile: "bg-white/5 text-slate-200 border-white/10", key: "it" },
  { label: "HRMS", Icon: Building2, tile: "bg-white/5 text-slate-200 border-white/10", key: "hrms" },
  { label: "Staffing & Resource Management", Icon: Users, tile: "bg-orange-400/10 text-orange-300 border-orange-400/20", key: "staffing" },
  { label: "Shop Floor & Machine Monitoring", Icon: Activity, tile: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20", key: "shopfloor" },
  { label: "AI & Business Intelligence", Icon: Bot, tile: "bg-orange-400/10 text-orange-300 border-orange-400/20", key: "ai" },
];

const PLATFORM_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Why Synax", href: "/why-synax" },
  { label: "Synax AI", href: hrefFor("ai") },
  { label: "Security & Trust", href: "/security" },
];

const GROUP_LINKS = [
  { label: "Senwell Exports", href: "https://senwellexports.com/" },
  { label: "Stacwell", href: "https://stacwell.com/" },
  { label: "Stacem", href: "https://www.stacem.com/" },
];

const COMPLIANCE = [
  { Icon: ShieldCheck, label: "AS9100D QMS controls" },
  { Icon: CheckCircle2, label: "GST e-invoice & e-way bill" },
  { Icon: Award, label: "Works with Tally" },
  { Icon: Lock, label: "DPDP Act, 2023 privacy policy" },
];

/** A fixed year: new Date() cannot be read while prerendering a client component. Update each January. */
const COPYRIGHT_YEAR = 2026;

const linkClass =
  "rounded-sm text-sm text-slate-300 transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300";

const columnHeading = "mb-4 text-xs font-bold tracking-[0.14em] text-orange-300 uppercase";

export function Footer() {
  const { openDemo, openTour } = useDemo();
  const onScheduleDemo = () => openDemo();
  const onWatchOverview = () => openTour("Synax Platform Overview");

  return (
    <footer className="relative isolate overflow-hidden bg-slate-950 text-slate-300">
      {/* Decorative: top accent line, soft glows, fine dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-80 w-80 rounded-full bg-blue-900/40 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        {/* 1. Closing CTA */}
        <section
          aria-labelledby="footer-cta-title"
          className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-7 shadow-2xl md:flex-row md:items-center md:p-10"
        >
          <div className="max-w-xl">
            <SectionTag tone="dark" lines="start">Get started</SectionTag>
            <h2 id="footer-cta-title" className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              See all six Synax products working together
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              A 30-minute walkthrough of the modules that matter to your business.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onScheduleDemo}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              <span>Schedule a Demo</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onWatchOverview}
              className="flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white/15 text-slate-200" aria-hidden="true">
                <Play className="size-3 fill-current" />
              </span>
              <span>Watch overview</span>
            </button>
          </div>
        </section>

        {/* 2. Link grid */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/erp"
              aria-label="Synax by Senwell — home"
              className="inline-block rounded-lg bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/synax_logo.png" alt="" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              Synax is a unified business suite by <strong className="text-white">Senwell Group</strong>: manufacturing,
              IT services and projects, HRMS, staffing, shop-floor monitoring and AI in one connected,
              audit-ready platform.
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-slate-500">Web</dt>
                <dd>
                  <a
                    href="https://synax.senwellgroup.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    synax.senwellgroup.com
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-500">HQ</dt>
                <dd className="text-slate-300">Senwell Industrial Park</dd>
              </div>
            </dl>
          </div>

          {/* Products */}
          <nav aria-label="Synax products" className="lg:col-span-4">
            <h3 className={columnHeading}>Products</h3>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <li key={p.label}>
                  <Link
                    href={hrefFor(p.key)}
                    className="group flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
                  >
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${p.tile}`}>
                      <p.Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-snug text-slate-300 transition-colors group-hover:text-orange-300">
                      {p.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform */}
          <nav aria-label="Platform" className="lg:col-span-2">
            <h3 className={columnHeading}>Platform</h3>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-2">
            <h3 className={columnHeading}>Senwell Group</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/erp#senwell" className={linkClass}>
                  About Senwell
                </Link>
              </li>
              {GROUP_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                    {l.label}
                    <ArrowUpRight className="size-3.5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={onScheduleDemo} className={`${linkClass} cursor-pointer text-left font-semibold`}>
                  Contact Sales
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* 3. Compliance alignment */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center">
          <p className="shrink-0 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Compliance alignment</p>
          <ul className="flex flex-wrap gap-2">
            {COMPLIANCE.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                <Icon className="size-3.5 text-orange-300" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Legal bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {COPYRIGHT_YEAR} Synax by Senwell Group. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href="https://synax.senwellgroup.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Privacy Policy
            </a>
            <a
              href="https://synax.senwellgroup.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Terms of Service
            </a>
            <Link
              href="/security"
              className="rounded-sm transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Security
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 transition-colors hover:border-orange-400/40 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              Back to top
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
