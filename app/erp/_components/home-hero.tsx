"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, Bot, Briefcase, Building2, CircleCheck, Factory, Play, Users } from "lucide-react";

/**
 * Landing-page hero: the real dashboard is the focus, and the six products point at it.
 *
 *  - The dashboard (glass frame on two tinted "platform" plates) comes first, with the six product
 *    cards beside it (3 + 3 from `lg`; a grid under it on smaller screens). The intro (headline,
 *    product name, paragraph, CTAs, tick lines) comes after, set smaller on purpose. The cards sit on
 *    the sides — not in a row underneath — so the CTAs stay inside the first viewport.
 *  - The intro stays first in the DOM (reading order / SEO) and is moved below with `order`.
 *  - One product is active at a time. Its card is highlighted, an orange outline glides to the matching
 *    module on the dashboard (`region`, % of the screenshot) and — from `lg` — a dashed line is drawn
 *    from the card to that module. The headline's product name follows.
 *  - It steps through the products every few seconds until the visitor hovers, focuses or taps one;
 *    it never auto-advances for `prefers-reduced-motion`.
 *
 * `region` values are measured on `hero-dashboard-light.webp` — re-measure them if the screenshot is
 * replaced. The state lives here (not in `HomeView`), so only this component re-renders.
 */

/** Height of the announcement banner (~2rem) + sticky header (4rem). */
const HERO_MIN_HEIGHT = "lg:min-h-[calc(100svh-6.25rem)]";
const CYCLE_MS = 2800;

/**
 * The screenshot is shown a little taller than its native shape (1918×917 ≈ 2.09:1) by cropping an equal strip off both
 * sides (`object-cover`). `region` values are fractions of the FULL screenshot, so they are re-mapped onto the visible part.
 */
const NATIVE_RATIO = 1918 / 917;
const FRAME_RATIO = NATIVE_RATIO; // = no crop; use a smaller number to make it taller (crops the sides)
const VISIBLE_W = FRAME_RATIO / NATIVE_RATIO;
const CROP_X = (1 - VISIBLE_W) / 2;
const mapX = (x: number) => Math.min(1, Math.max(0, (x - CROP_X) / VISIBLE_W));

interface HeroProduct {
  label: string;
  desc: string;
  Icon: typeof Factory;
  /** Same colours the Products menu uses for this product. */
  tile: string;
  side: "left" | "right";
  /** 0 = top, 1 = middle, 2 = bottom card within its side. */
  slot: 0 | 1 | 2;
  /** Module on the screenshot this product maps to: [x0, y0, x1, y1] as fractions. */
  region: [number, number, number, number];
}

// Listed in cycle order.
const HERO_PRODUCTS: HeroProduct[] = [
  {
    label: "Manufacturing ERP",
    desc: "Planning, procurement, shop-floor, quality & costing",
    Icon: Factory,
    tile: "bg-emerald-50 text-emerald-600",
    side: "left",
    slot: 2,
    region: [0.17, 0.535, 0.47, 0.72],
  },
  {
    label: "IT Services & Project ERP",
    desc: "Projects, SOWs, resources, timesheets & billing",
    Icon: Briefcase,
    tile: "bg-slate-100 text-blue-900",
    side: "left",
    slot: 1,
    region: [0.17, 0.33, 0.47, 0.52],
  },
  {
    label: "HRMS",
    desc: "Employee lifecycle, attendance, payroll & performance",
    Icon: Building2,
    tile: "bg-slate-100 text-blue-900",
    side: "right",
    slot: 1,
    region: [0.48, 0.33, 0.78, 0.52],
  },
  {
    label: "Staffing & Resource Management",
    desc: "Customer needs, candidates, interviews & deployments",
    Icon: Users,
    tile: "bg-orange-50 text-orange-700",
    side: "left",
    slot: 0,
    region: [0.01, 0.31, 0.155, 0.36],
  },
  {
    label: "Shop Floor & Machine Monitoring",
    desc: "Scheduling, job cards, live machines & downtime",
    Icon: Activity,
    tile: "bg-emerald-50 text-emerald-600",
    side: "right",
    slot: 2,
    region: [0.48, 0.535, 0.78, 0.72],
  },
  {
    label: "AI & Business Intelligence",
    desc: "AI assistance, agents, analytics & reports",
    Icon: Bot,
    tile: "bg-orange-50 text-orange-700",
    side: "right",
    slot: 0,
    region: [0.79, 0.185, 0.99, 0.355],
  },
];

const HERO_TICKS = [
  "Role-based access and audit trail",
  "Real-time operational visibility",
  "AI-assisted insights and automation",
];

// Literal class names so Tailwind can see them.
const COL_START = { left: "lg:col-start-1", right: "lg:col-start-3" } as const;
const ROW_START = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"] as const;

/** The gradient product name; all names share one grid cell so the block never jumps. */
function ActiveProductName({ active }: { active: number }) {
  return (
    <span className="mt-0.5 grid justify-items-center text-[0.78em]" aria-hidden="true">
      {HERO_PRODUCTS.map(({ label }, i) => (
        <span
          key={label}
          className={`col-start-1 row-start-1 w-fit bg-gradient-to-r from-violet-600 via-indigo-500 to-teal-500 bg-clip-text pb-1 text-transparent transition-all duration-500 ${
            i === active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {label}
        </span>
      ))}
    </span>
  );
}

/** Dot grid, soft light-orange glow and a navy / light-orange base line. Purely decorative. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(30,58,138,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_35%,transparent_80%)]" />
      <div className="absolute top-12 left-1/2 aspect-square w-[40rem] -translate-x-1/2 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-900" />
      <div className="absolute bottom-0 left-0 h-1 w-32 bg-orange-300" />
    </div>
  );
}

export function Hero({
  onScheduleDemo,
  onWatchOverview,
}: {
  onScheduleDemo: () => void;
  onWatchOverview: () => void;
}) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  // Step through the products until the visitor takes over (never for reduced motion).
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % HERO_PRODUCTS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [auto]);

  // Draw the connector (lg+) from the active card to its module on the dashboard.
  // Done imperatively from DOM measurements, so it needs no state of its own.
  useEffect(() => {
    const draw = () => {
      const stage = stageRef.current;
      const image = imageRef.current;
      const chip = chipRefs.current[active];
      const path = pathRef.current;
      const dot = dotRef.current;
      if (!stage || !image || !chip || !path || !dot) return;

      const p = HERO_PRODUCTS[active];
      const s = stage.getBoundingClientRect();
      const i = image.getBoundingClientRect();
      const c = chip.getBoundingClientRect();

      const [rx0, y0, rx1, y1] = p.region;
      const x0 = mapX(rx0);
      const x1 = mapX(rx1);
      const left = p.side === "left";
      const ax = (left ? c.right : c.left) - s.left;
      const ay = c.top + c.height / 2 - s.top;
      const tx = i.left - s.left + (left ? x0 : x1) * i.width;
      const ty = i.top - s.top + ((y0 + y1) / 2) * i.height;
      const d = (tx - ax) / 2;

      path.setAttribute("d", `M${ax} ${ay} C${ax + d} ${ay} ${tx - d} ${ty} ${tx} ${ty}`);
      dot.setAttribute("cx", String(tx));
      dot.setAttribute("cy", String(ty));
    };

    draw();
    const stage = stageRef.current;
    const observer = stage ? new ResizeObserver(draw) : null;
    if (stage && observer) observer.observe(stage);
    return () => observer?.disconnect();
  }, [active]);

  const pick = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  const [rawX0, ry0, rawX1, ry1] = HERO_PRODUCTS[active].region;
  const rx0 = mapX(rawX0);
  const rx1 = mapX(rawX1);

  return (
    <section
      aria-labelledby="hero-heading"
      className={`relative isolate overflow-hidden px-4 pt-6 pb-10 sm:px-6 md:pt-8 lg:flex lg:items-center lg:py-1 ${HERO_MIN_HEIGHT}`}
    >
      <HeroBackdrop />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 lg:gap-[clamp(0.75rem,2vh,1.5rem)]">
        {/* Intro: first in the DOM, shown below the image */}
        <div className="order-2 mx-auto flex max-w-2xl flex-col items-center gap-3 text-center lg:gap-[clamp(0.75rem,1.9vh,1.25rem)]">
          <h1
            id="hero-heading"
            className="text-[2rem] leading-[1.08] font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[clamp(2rem,5vh,3rem)]"
          >
            <span className="block">
              One Platform for{" "}
              <span className="relative inline-block">
                Every Operation
                {/* Hand-drawn underline flourish */}
                <svg
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full text-orange-400"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7 C40 1 80 9 120 4 S180 3 198 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </span>
            {/* Screen readers get the full list once instead of a changing name. */}
            <span className="sr-only">: {HERO_PRODUCTS.map((p) => p.label).join(", ")}</span>
            <ActiveProductName active={active} />
          </h1>


          <div className="flex w-full flex-col items-stretch justify-center gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onScheduleDemo}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-900 px-5 py-2.5 text-[0.8125rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 hover:shadow-md"
            >
              <span>Schedule a Demo</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onWatchOverview}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-orange-400 bg-transparent px-4 py-2 text-[0.8125rem] font-semibold text-slate-900 transition-colors hover:bg-orange-50"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-200 text-slate-600" aria-hidden="true">
                <Play className="size-2.5 fill-current" />
              </span>
              <span>Watch overview</span>
            </button>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[11.5px] text-slate-600 sm:text-xs">
            {HERO_TICKS.map((tick) => (
              <li key={tick} className="flex items-center gap-1.5">
                <CircleCheck className="size-4 shrink-0 text-orange-400" aria-hidden="true" />
                {tick}
              </li>
            ))}
          </ul>
        </div>

        {/* Stage: dashboard in the middle, products on either side. Its width is capped by the viewport height
            on lg+, so the whole stage (and the CTAs below it) fits the first screen. */}
        <div
          ref={stageRef}
          className="synax-hero-visual relative order-1 mx-auto grid w-full gap-4 lg:max-w-[calc(47vh*2.1+2*var(--g)+3rem)] lg:grid-cols-[var(--g)_minmax(0,1fr)_var(--g)] lg:grid-rows-3 lg:gap-x-5 lg:gap-y-2 lg:[--g:9.5rem] xl:[--g:11.5rem]"
        >
          {/* Connector (lg+): from the active card to its module */}
          <svg
            className="pointer-events-none absolute inset-0 z-10 hidden size-full overflow-visible lg:block"
            aria-hidden="true"
          >
            <path
              key={active}
              ref={pathRef}
              fill="none"
              stroke="#fb923c"
              strokeWidth="1.8"
              strokeDasharray="5 4"
              className="synax-hero-fade"
            />
            <circle ref={dotRef} r="4.5" fill="#fb923c" cx="-20" cy="-20" />
          </svg>

          {/* Dashboard on platform plates */}
          <div className="relative self-center pb-8 lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <div className="absolute inset-x-10 top-10 bottom-1 rounded-2xl border border-orange-300 bg-orange-400/15" aria-hidden="true" />
            <div className="absolute inset-x-5 top-6 bottom-[18px] rounded-2xl border border-blue-900/20 bg-blue-900/[0.07]" aria-hidden="true" />
            <div className="absolute inset-x-10 -bottom-1 h-4 rounded-[50%] bg-slate-900/10 blur-md" aria-hidden="true" />

            <div className="relative rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_22px_44px_-20px_rgba(11,27,51,0.42)]">
              <div ref={imageRef} className="relative overflow-hidden rounded-xl ring-1 ring-slate-900/5">
                <Image
                  src="/images/hero-dashboard-light.webp"
                  alt="Synax Enterprise ERP Command Dashboard"
                  width={1918}
                  height={917}
                  priority
                  sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 50vw, 100vw"
                  className="block aspect-[1918/917] w-full object-cover"
                  draggable={false}
                />
                {/* Spotlight on the active module */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-lg border-2 border-orange-400 bg-orange-400/10 shadow-[0_0_0_4px_rgba(251,146,60,0.16)] transition-[left,top,width,height] duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    left: `${rx0 * 100}%`,
                    top: `${ry0 * 100}%`,
                    width: `${(rx1 - rx0) * 100}%`,
                    height: `${(ry1 - ry0) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* The six products (a grid below lg; placed beside the dashboard from lg) */}
          <ul
            aria-label="Synax products"
            className="grid gap-2 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:contents"
          >
            {HERO_PRODUCTS.map((p, i) => {
              const on = i === active;
              return (
                <li
                  key={p.label}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className={`flex lg:self-center ${COL_START[p.side]} ${ROW_START[p.slot]}`}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-white/90 p-2 text-left shadow-xs backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
                      on
                        ? "-translate-y-0.5 border-orange-400 shadow-md ring-1 ring-orange-400"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${p.tile}`}>
                      <p.Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11.5px] leading-tight font-semibold text-slate-900">{p.label}</span>
                      <span className="mt-0.5 hidden text-[11px] leading-tight text-slate-500 xl:block">
                        {p.desc}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
