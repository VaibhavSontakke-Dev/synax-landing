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
import Link from "next/link";
import { useDemo } from "./demo-provider";
import { hrefFor, type ProductKey } from "../_data/products";
import { LIVE_POSITIONING } from "../_data/live";

/**
 * Landing-page footer (dark navy).
 *
 * Layout: brand column (white Synax PRO logo, positioning line, contact) · six products · platform · company,
 * then compliance chips and a legal bar with back-to-top. The logo is a white knockout of the brand logo
 * (`/images/synax-pro-light.png`) so it sits straight on the dark surface, with a soft glow behind it. A faint
 * "SYNAX" watermark runs along the bottom. Everything is real navigation inside labelled <nav>s.
 */

interface FooterProduct {
  label: string;
  Icon: LucideIcon;
  key: ProductKey;
}

// Same destinations as the header's Products menu.
const PRODUCTS: FooterProduct[] = [
  { label: "Manufacturing ERP", Icon: Factory, key: "precision" },
  { label: "Work & Delivery Management", Icon: Briefcase, key: "it" },
  { label: "HRMS", Icon: Building2, key: "hrms" },
  { label: "Staffing & Resource Management", Icon: Users, key: "staffing" },
  { label: "Shop Floor & Machine Monitoring", Icon: Activity, key: "shopfloor" },
  { label: "AI & Business Intelligence", Icon: Bot, key: "ai" },
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

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300";

const linkClass = `inline-block rounded-sm text-sm text-slate-300 transition-all duration-200 hover:translate-x-0.5 hover:text-orange-300 ${FOCUS}`;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-xs font-bold tracking-[0.14em] text-white uppercase">
      {children}
      <span className="mt-2 block h-0.5 w-6 rounded-full bg-orange-300" aria-hidden="true" />
    </h3>
  );
}

export function Footer() {
  const { openDemo } = useDemo();
  const onScheduleDemo = () => openDemo();

  return (
    <footer className="relative isolate overflow-hidden bg-blue-950 text-slate-300">
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

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/erp" aria-label="Synax by Senwell — home" className={`relative inline-block rounded-lg ${FOCUS}`}>
              <span className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-full bg-blue-500/20 blur-2xl" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/synax-pro-light.png" alt="" width={900} height={247} className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-orange-300">{LIVE_POSITIONING.headline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300">
              Synax is a unified business suite by <strong className="text-white">Senwell Group</strong>: manufacturing,
              work and delivery management, HRMS, staffing, shop-floor monitoring and AI in one connected,
              audit-ready platform.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-200">
                  <Globe className="size-4" aria-hidden="true" />
                </span>
                <a href="https://synax.senwellgroup.com" target="_blank" rel="noopener noreferrer" className={`${linkClass} hover:translate-x-0`}>
                  synax.senwellgroup.com
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-200">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="text-slate-300">Senwell Industrial Park</span>
              </li>
            </ul>
          </div>

          {/* Products */}
          <nav aria-label="Synax products" className="lg:col-span-4">
            <ColumnHeading>Products</ColumnHeading>
            <ul className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <li key={p.label}>
                  <Link href={hrefFor(p.key)} className={`group flex w-full items-center gap-3 rounded-md text-left ${FOCUS}`}>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-200 transition-colors group-hover:border-orange-300/50 group-hover:bg-orange-300/10 group-hover:text-orange-300">
                      <p.Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-snug text-slate-300 transition-colors group-hover:text-orange-300">{p.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform */}
          <nav aria-label="Platform" className="lg:col-span-2">
            <ColumnHeading>Platform</ColumnHeading>
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
            <ColumnHeading>Senwell Group</ColumnHeading>
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
                <button type="button" onClick={onScheduleDemo} className={`${linkClass} cursor-pointer text-left font-semibold text-white`}>
                  Contact Sales
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Compliance alignment */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center">
          <p className="shrink-0 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Compliance alignment</p>
          <ul className="flex flex-wrap gap-2">
            {COMPLIANCE.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-orange-300" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-slate-400 sm:flex-row">
          <p>© {COPYRIGHT_YEAR} Synax by Senwell Group. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href="https://synax.senwellgroup.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}
            >
              Privacy Policy
            </a>
            <a
              href="https://synax.senwellgroup.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}
            >
              Terms of Service
            </a>
            <Link href="/security" className={`rounded-sm transition-colors hover:text-orange-300 ${FOCUS}`}>
              Security
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border border-orange-300/40 bg-white/5 px-3 py-1.5 font-semibold text-slate-100 transition-colors hover:border-orange-300 hover:bg-orange-300/10 hover:text-orange-300 ${FOCUS}`}
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
