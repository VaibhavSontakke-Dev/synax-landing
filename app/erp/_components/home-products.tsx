"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Activity, Bot, Briefcase, Building2, Check, ChevronLeft, ChevronRight, Factory, Users } from "lucide-react";
import { SectionTag } from "./section-tag";
import { hrefFor, type ProductKey } from "../_data/products";

/**
 * "Market-Ready Platforms" — the six-product carousel.
 *
 * Icon colours are the Products menu's (green / navy / orange). Buttons follow the
 * hero's two styles: Demo = solid navy (the primary action), Explore = 2px orange outline. The carousel
 * state that used to live in HomeView (and re-rendered the whole page on every
 * scroll tick) is local here. Copy is the original section's.
 */

type Tone = "emerald" | "navy" | "orange";

const TONES: Record<Tone, { bar: string; tile: string; chipTile: string; tag: string; check: string }> = {
  emerald: {
    bar: "border-t-emerald-600",
    tile: "bg-emerald-50 border-emerald-200 text-emerald-600",
    chipTile: "bg-emerald-50 text-emerald-600",
    tag: "bg-emerald-50 text-emerald-700",
    check: "text-emerald-600",
  },
  navy: {
    bar: "border-t-blue-900",
    tile: "bg-slate-100 border-slate-300 text-blue-900",
    chipTile: "bg-slate-100 text-blue-900",
    tag: "bg-slate-100 text-blue-900",
    check: "text-blue-900",
  },
  orange: {
    bar: "border-t-orange-600",
    tile: "bg-orange-50 border-orange-200 text-orange-700",
    chipTile: "bg-orange-50 text-orange-700",
    tag: "bg-orange-50 text-orange-700",
    check: "text-orange-600",
  },
};

interface Product {
  title: string;
  shortLabel: string;
  Icon: LucideIcon;
  tone: Tone;
  tag: string;
  tagline: string;
  statLabel: string;
  statValue: string;
  bullets: string[];
  /** The product's own page: /products/<slug>. */
  key: ProductKey;
  demoName: string;
}

const PRODUCTS: Product[] = [
  {
    title: "Manufacturing ERP",
    shortLabel: "Manufacturing ERP",
    Icon: Factory,
    tone: "emerald",
    tag: "Core ERP",
    tagline: "Customer material, route cards, and machine-to-invoice control.",
    statLabel: "Production Flow",
    statValue: "Spindle to Invoice",
    bullets: [
      "POs, challans & material ID ranges",
      "Material balances, use, returns & scrap",
      "Machine counts & downtime on route cards",
      "Inspection, COC, dispatch & Tally",
    ],
    key: "precision",
    demoName: "Manufacturing ERP",
  },
  {
    title: "IT Services & Project ERP",
    shortLabel: "IT Services",
    Icon: Briefcase,
    tone: "navy",
    tag: "Core ERP",
    tagline: "Manage project delivery and profitability across IT service teams.",
    statLabel: "Business Lifecycle",
    statValue: "Project to Billing",
    bullets: [
      "Project and work tracking with customer requirements",
      "SOWs, resource allocation, and staffing",
      "Timesheets, work logs, and development costs",
      "Project billing and profitability",
    ],
    key: "it",
    demoName: "IT Services & Project ERP",
  },
  {
    title: "HRMS",
    shortLabel: "HRMS",
    Icon: Building2,
    tone: "navy",
    tag: "Standalone or Integrated Solution",
    tagline: "Employee operations and workforce administration.",
    statLabel: "Monthly Payroll Run Speed",
    statValue: "< 60 Sec",
    bullets: [
      "Employee lifecycle, recruitment, and offboarding",
      "Attendance, leave, payroll, and compliance",
      "Daily Work Management (DWM)",
      "Performance management",
    ],
    key: "hrms",
    demoName: "HRMS",
  },
  {
    title: "Staffing & Resource Management",
    shortLabel: "Staffing",
    Icon: Users,
    tone: "orange",
    tag: "Product Solution",
    tagline: "Source, deploy, and manage customer staffing requirements.",
    statLabel: "Product Focus",
    statValue: "Talent Deployment",
    bullets: [
      "Customer requirements and candidate management",
      "Interviews, offers, and onboarding",
      "Deployments and resource performance",
      "Replacements and approvals",
    ],
    key: "staffing",
    demoName: "Staffing & Resource Management",
  },
  {
    title: "Shop Floor & Machine Monitoring",
    shortLabel: "Shop floor",
    Icon: Activity,
    tone: "emerald",
    tag: "Product Solution",
    tagline: "Production execution and machine operations management.",
    statLabel: "Product Focus",
    statValue: "Machine Execution",
    bullets: [
      "Machine scheduling and load charts",
      "Operator job cards and live machine monitoring",
      "Downtime and alarm visibility",
      "Production tracking and machine utilization",
    ],
    key: "shopfloor",
    demoName: "Shop Floor & Machine Monitoring",
  },
  {
    title: "AI & Business Intelligence",
    shortLabel: "AI and BI",
    Icon: Bot,
    tone: "orange",
    tag: "Product Solution",
    tagline: "Intelligent assistance and insights for business operations.",
    statLabel: "Product Focus",
    statValue: "Insights & Assistance",
    bullets: [
      "AI-powered assistance and Synax Agents",
      "Operational analytics and business dashboards",
      "Reports across business workflows",
      "Performance insights for informed decisions",
    ],
    key: "ai",
    demoName: "AI & Business Intelligence",
  },
];

export function Products({ openModal }: { openModal: (productName?: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [edges, setEdges] = useState({ canPrev: false, canNext: true });

  const step = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !(first instanceof HTMLElement)) return 0;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  const scrollBy = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * step(), behavior: behavior() });
  };

  const scrollToIndex = (index: number) => {
    trackRef.current?.scrollTo({ left: index * step(), behavior: behavior() });
  };

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const max = Math.max(scrollWidth - clientWidth, 0);
    setProgress(max === 0 ? 0 : scrollLeft / max);
    setEdges({ canPrev: scrollLeft > 1, canNext: scrollLeft < max - 1 });
    const s = step();
    if (s > 0) setActiveIndex(Math.min(PRODUCTS.length - 1, Math.round(scrollLeft / s)));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scrollBy(event.key === "ArrowRight" ? 1 : -1);
    }
  };

  return (
    <section id="products" aria-labelledby="products-heading" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 space-y-3 text-center">
        <SectionTag>Market-Ready Platforms</SectionTag>
        <h2 id="products-heading" className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
          Six connected products for manufacturing and IT operations
        </h2>
        <p className="mx-auto max-w-2xl text-xs text-slate-600 sm:text-sm">
          Two core ERPs anchor the portfolio, with HRMS, staffing, shop-floor monitoring, and AI available as
          standalone solutions or integrated capabilities, depending on packaging.
        </p>
      </div>

      {/* Quick picks */}
      <ul className="mb-6 flex flex-wrap justify-center gap-2" aria-label="Jump to a product">
        {PRODUCTS.map((p, i) => {
          const tone = TONES[p.tone];
          const active = i === activeIndex;
          return (
            <li key={p.title}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-current={active ? "true" : undefined}
                className={`flex cursor-pointer items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  active
                    ? "border-2 border-blue-900 font-semibold text-slate-900"
                    : "border border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className={`flex size-6 items-center justify-center rounded-lg ${tone.chipTile}`}>
                  <p.Icon className="size-3.5" aria-hidden="true" />
                </span>
                {p.shortLabel}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Carousel controls */}
      <div className="mb-3 flex items-center justify-end gap-3">
        <span className="text-xs font-medium text-slate-500">
          {activeIndex + 1} of {PRODUCTS.length}
        </span>
        <div
          className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 sm:w-24"
          role="progressbar"
          aria-label="Product carousel position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-blue-900 transition-[width] duration-200"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!edges.canPrev}
          aria-label="Previous products"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!edges.canNext}
          aria-label="Next products"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Cards */}
      <div
        id="product-cards"
        ref={trackRef}
        role="region"
        aria-label="Product offerings"
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="grid auto-cols-[84%] grid-flow-col grid-rows-[minmax(32rem,auto)] snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] sm:auto-cols-[47%] lg:auto-cols-[22%] [&::-webkit-scrollbar]:hidden"
      >
        {PRODUCTS.map((p, i) => {
          const tone = TONES[p.tone];
          return (
            <article
              key={p.title}
              data-product-slide
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${PRODUCTS.length}: ${p.title}`}
              className={`flex h-full min-w-0 snap-start flex-col rounded-b-2xl rounded-t-sm border border-t-[3px] border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-xl ${tone.bar}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                  <p.Icon className="size-[22px]" aria-hidden="true" />
                </span>
                <span className={`rounded-md px-2 py-0.5 text-right text-[11px] leading-tight font-semibold ${tone.tag}`}>
                  {p.tag}
                </span>
              </div>

              <h3 className="mt-3 min-h-[2.75rem] text-lg leading-tight font-extrabold text-slate-900">{p.title}</h3>
              <p className="mt-1 min-h-[2rem] line-clamp-2 text-xs font-medium text-slate-500">{p.tagline}</p>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-500">{p.statLabel}</span>
                <span className="text-right font-semibold text-slate-900">{p.statValue}</span>
              </div>

              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {p.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                    <span className="line-clamp-2">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={hrefFor(p.key)}
                  aria-label={`Explore ${p.title}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-orange-500 bg-transparent px-3 py-[10px] text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <span>Explore</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => openModal(p.demoName)}
                  className="cursor-pointer rounded-lg bg-blue-900 px-5 py-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  Demo
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
