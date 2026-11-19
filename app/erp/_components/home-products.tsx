"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
    tile: "bg-slate-100 border-slate-300 text-brand",
    chipTile: "bg-slate-100 text-brand",
    tag: "bg-slate-100 text-brand",
    check: "text-brand",
  },
  orange: {
    bar: "border-t-orange-600",
    tile: "bg-orange-50 border-orange-200 text-accent-strong",
    chipTile: "bg-orange-50 text-accent-strong",
    tag: "bg-orange-50 text-accent-strong",
    check: "text-accent",
  },
};

interface Product {
  Icon: LucideIcon;
  tone: Tone;
  /** The product's own page: /products/<slug>. Also the message id: texts live in messages/*.json under "Carousel.items.<key>". */
  key: ProductKey;
  demoName: string;
}

// Listed in carousel order. Names come from "Products.<key>.name"; everything else from "Carousel.items.<key>".
const PRODUCTS: Product[] = [
  { Icon: Factory, tone: "emerald", key: "precision", demoName: "Manufacturing ERP" },
  { Icon: Building2, tone: "navy", key: "hrms", demoName: "HRMS" },
  { Icon: Activity, tone: "emerald", key: "shopfloor", demoName: "Shop Floor & Machine Monitoring" },
  { Icon: Briefcase, tone: "navy", key: "it", demoName: "Work & Delivery Management" },
  { Icon: Users, tone: "orange", key: "staffing", demoName: "Staffing & Resource Management" },
  { Icon: Bot, tone: "orange", key: "ai", demoName: "AI & Business Intelligence" },
];

const BULLETS = ["b1", "b2", "b3", "b4"] as const;

export function Products() {
  const t = useTranslations("Carousel");
  const tp = useTranslations("Products");
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
    <section id="products" aria-labelledby="products-heading" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div data-anim-stagger="rise" className="mb-8 space-y-3 text-center">
        <SectionTag>{t("tag")}</SectionTag>
        <h2 id="products-heading" className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-2xl text-xs text-slate-600 sm:text-sm">
          {t("lead")}
        </p>
      </div>

      {/* Quick picks */}
      <ul data-anim="rise" className="mb-6 flex flex-wrap justify-center gap-2" aria-label={t("jumpAria")}>
        {PRODUCTS.map((p, i) => {
          const tone = TONES[p.tone];
          const active = i === activeIndex;
          return (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-current={active ? "true" : undefined}
                className={`flex cursor-pointer items-center gap-2 rounded-full bg-surface py-1.5 pr-3 pl-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  active
                    ? "border-2 border-brand-line font-semibold text-slate-900"
                    : "border border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className={`flex size-6 items-center justify-center rounded-lg ${tone.chipTile}`}>
                  <p.Icon className="size-3.5" aria-hidden="true" />
                </span>
                {t(`items.${p.key}.short`)}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Carousel controls */}
      <div className="mb-3 flex items-center justify-end gap-3">
        <span className="text-xs font-medium text-slate-500">
          {t("position", { current: activeIndex + 1, total: PRODUCTS.length })}
        </span>
        <div
          className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 sm:w-24"
          role="progressbar"
          aria-label={t("progressAria")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-brand-solid transition-[width] duration-200"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!edges.canPrev}
          aria-label={t("prev")}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-surface text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!edges.canNext}
          aria-label={t("next")}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-surface text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Cards */}
      <div
        id="product-cards"
        ref={trackRef}
        role="region"
        aria-label={t("region")}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        data-anim="rise-lg"
        className="grid auto-cols-[84%] grid-flow-col grid-rows-[minmax(32rem,auto)] snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] sm:auto-cols-[47%] lg:auto-cols-[22%] [&::-webkit-scrollbar]:hidden"
      >
        {PRODUCTS.map((p, i) => {
          const tone = TONES[p.tone];
          return (
            <article
              key={p.key}
              data-product-slide
              aria-roledescription="slide"
              aria-label={t("slide", { current: i + 1, total: PRODUCTS.length, title: tp(`${p.key}.name`) })}
              className={`flex h-full min-w-0 snap-start flex-col rounded-b-2xl rounded-t-sm border border-t-[3px] border-slate-200 bg-surface p-4 shadow-sm transition-shadow duration-200 hover:shadow-xl ${tone.bar}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                  <p.Icon className="size-[22px]" aria-hidden="true" />
                </span>
                <span className={`rounded-md px-2 py-0.5 text-right text-[11px] leading-tight font-semibold ${tone.tag}`}>
                  {t(`items.${p.key}.tag`)}
                </span>
              </div>

              <h3 className="mt-3 min-h-[2.75rem] text-lg leading-tight font-extrabold text-slate-900">{tp(`${p.key}.name`)}</h3>
              <p className="mt-1 min-h-[2rem] line-clamp-2 text-xs font-medium text-slate-500">{t(`items.${p.key}.tagline`)}</p>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-500">{t(`items.${p.key}.statLabel`)}</span>
                <span className="text-right font-semibold text-slate-900">{t(`items.${p.key}.statValue`)}</span>
              </div>

              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {BULLETS.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                    <span className="line-clamp-2">{t(`items.${p.key}.${bullet}`)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={hrefFor(p.key)}
                  aria-label={t("exploreAria", { title: tp(`${p.key}.name`) })}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-orange-500 bg-transparent px-3 py-[10px] text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <span>{t("explore")}</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
