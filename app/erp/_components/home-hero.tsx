"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { DashboardMotion, type HazeBox } from "./dashboard-motion";
import { Activity, ArrowRight, Bot, Briefcase, Building2, CircleCheck, Factory, Play, Users, ZoomIn } from "lucide-react";

/**
 * Landing-page hero: the real dashboard is the focus, and the six products point at it.
 *
 *  - The dashboard (glass frame on two tinted "platform" plates) comes first, with the six product
 *    cards beside it (3 + 3 from `lg`; a grid under it on smaller screens). The intro (headline,
 *    product name, paragraph, CTAs, tick lines) comes after, set smaller on purpose. The cards sit on
 *    the sides — not in a row underneath — so the CTAs stay inside the first viewport. On wide screens the
 *    cards are scattered (`shift`) into the empty space beside the stage; the dashboard keeps its size.
 *  - The intro stays first in the DOM (reading order / SEO) and is moved below with `order`.
 *  - One product is active at a time. Its card is highlighted, an orange outline glides to the matching
 *    module on the dashboard (`region`, % of the screenshot) and — from `lg` — a dashed line is drawn
 *    from the card to that module. The headline's product name follows.
 *  - It steps through the products every few seconds until the visitor hovers, focuses or taps one;
 *    it never auto-advances for `prefers-reduced-motion`.
 *
 * The dashboard is an illustration, not a portal screenshot (source: tools/hero-dashboard/). What the six products point at
 * stays sharp (the Projects and Staffing menus; the Overview, Planning & Production, Purchase & SCM and People cards);
 * every other menu and card is frosted. Light: `hero-dashboard-v3.webp` (1748x1045) and the lens master
 * `hero-dashboard-v3-master.webp` (2x); dark: the same with `-dark`. Both themes share one layout, so each product's
 * `dark` region and lens equal the light ones. The airplane is not in the image: it is its own animated layer over the
 * banner. `region` / `crop` values come from tools/hero-dashboard/regions.json (re-run its render.js if the design changes).
 * The state lives here (not in `HomeView`), so only this component re-renders.
 */

/** Height of the announcement banner (~2rem) + sticky header (4rem). */
const HERO_MIN_HEIGHT = "lg:min-h-[calc(100svh-4.1rem)]";
const CYCLE_MS = 2800;

/** The displayed image is `hero-dashboard-v3.webp` (1748x1045); `region` values are fractions of it. */
const NATIVE_RATIO = 1748 / 1045;
const FRAME_RATIO = NATIVE_RATIO;

/** Size of the image the lens crops from (`hero-dashboard-v3-master.webp`, the same design at 2x). */
const MASTER_W = 3496;
const MASTER_H = 2090;
/** Same for the dark master (`hero-dashboard-v3-dark-master.webp`). */
const DARK_MASTER_W = 3496;
const DARK_MASTER_H = 2090;
/** Where the airplane flies: the dashboard's banner, as fractions of the image (tools/hero-dashboard/regions.json). */
const BANNER: [number, number, number, number] = [0.1442, 0.0134, 0.992, 0.1569];
/**
 * The frosted cards (fractions of the image, from tools/hero-dashboard/regions.json): a soft light sweeps across each in
 * turn, and the KPI tiles and machine-status card carry a pulsing "live" dot. Off for prefers-reduced-motion.
 */
const HAZE: HazeBox[] = [["kpi",0.1442,0.1722,0.2975,0.2641],["kpi",0.3055,0.1722,0.4588,0.2641],["kpi",0.4668,0.1722,0.6201,0.2641],["kpi",0.6281,0.1722,0.7815,0.2641],["card",0.5767,0.2794,0.7803,0.4325],["card",0.1442,0.4536,0.3478,0.6067],["card",0.5767,0.4536,0.7803,0.6067],["card",0.1442,0.6278,0.3478,0.7809],["card",0.3604,0.6278,0.5641,0.7809],["wide",0.1442,0.8057,0.7803,0.9856],["side",0.7895,0.1722,0.992,0.488],["machines",0.7895,0.5033,0.992,0.7522],["side",0.7895,0.7675,0.992,0.9856]];
/** How far the lens may poke out past the image edge, in px. */
const POKE = 14;
/** Every lens is this fraction of the displayed image width (less if there is no room), so all of them look alike. */
const LENS_W = 0.43;
const VISIBLE_W = FRAME_RATIO / NATIVE_RATIO;
const CROP_X = (1 - VISIBLE_W) / 2;
const mapX = (x: number) => Math.min(1, Math.max(0, (x - CROP_X) / VISIBLE_W));

interface HeroProduct {
  /** Message id: the name and short description live in messages/*.json under "Products.<id>". */
  id: "precision" | "it" | "hrms" | "staffing" | "shopfloor" | "ai";
  Icon: typeof Factory;
  /** Same colours the Products menu uses for this product. */
  tile: string;
  side: "left" | "right";
  /** 0 = top, 1 = middle, 2 = bottom card within its side. */
  slot: 0 | 1 | 2;
  /**
   * Scatter (lg+): how far the card drifts from its grid cell, as [x, y] multiples of `--sp` / `--spy` (up to 280px,
   * set in globals.css from the free space beside the stage). Negative x = left, negative y = up. [0, 0] keeps it in
   * place. The bottom cards drop below the dashboard, beside the headline.
   */
  shift: [number, number];
  /** Module on the screenshot this product maps to: [x0, y0, x1, y1] as fractions. */
  region: [number, number, number, number];
  /**
   * Magnified pop-out of the module (lg+): which part of the full-size screenshot to show (`crop`, fractions) and where
   * to put it relative to the spotlight. Every lens has the same width (`LENS_W`), so the zoom follows from the crop.
   */
  lens: { crop: [number, number, number, number]; at: "right" | "below" | "above" };
  /** The same two, measured on the dark screenshot (dark mode). */
  dark: { region: [number, number, number, number]; lens: { crop: [number, number, number, number]; at: "right" | "below" | "above" } };
}

// Listed in cycle order.
const HERO_PRODUCTS: HeroProduct[] = [
  {
    id: "precision",
    Icon: Factory,
    tile: "bg-emerald-50 text-emerald-600",
    side: "right",
    slot: 1,
    shift: [1, 0.21],
    region: [0.3604, 0.4536, 0.5641, 0.6067],
    lens: { crop: [0.3564, 0.4476, 0.5681, 0.6127], at: "right" },
    dark: { region: [0.3604, 0.4536, 0.5641, 0.6067], lens: { crop: [0.3564, 0.4476, 0.5681, 0.6127], at: "right" } },
  },
  {
    id: "it",
    Icon: Briefcase,
    tile: "bg-slate-100 text-brand",
    side: "left",
    slot: 0,
    shift: [-0.89, -0.16],
    region: [0.0069, 0.1684, 0.1281, 0.2067],
    lens: { crop: [0, 0.1334, 0.155, 0.2417], at: "right" },
    dark: { region: [0.0069, 0.1684, 0.1281, 0.2067], lens: { crop: [0, 0.1334, 0.155, 0.2417], at: "right" } },
  },
  {
    id: "hrms",
    Icon: Building2,
    tile: "bg-slate-100 text-brand",
    side: "right",
    slot: 2,
    shift: [0.25, 0.54],
    region: [0.5767, 0.6278, 0.7803, 0.7809],
    lens: { crop: [0.5727, 0.6218, 0.7843, 0.7869], at: "above" },
    dark: { region: [0.5767, 0.6278, 0.7803, 0.7809], lens: { crop: [0.5727, 0.6218, 0.7843, 0.7869], at: "above" } },
  },
  {
    id: "staffing",
    Icon: Users,
    tile: "bg-orange-50 text-accent-strong",
    side: "left",
    slot: 1,
    shift: [-0.21, 0.07],
    region: [0.0069, 0.2565, 0.1281, 0.2947],
    lens: { crop: [0, 0.2215, 0.155, 0.3297], at: "right" },
    dark: { region: [0.0069, 0.2565, 0.1281, 0.2947], lens: { crop: [0, 0.2215, 0.155, 0.3297], at: "right" } },
  },
  {
    id: "shopfloor",
    Icon: Activity,
    tile: "bg-emerald-50 text-emerald-600",
    side: "right",
    slot: 0,
    shift: [0.43, -0.14],
    region: [0.3604, 0.2794, 0.5641, 0.4325],
    lens: { crop: [0.3564, 0.2734, 0.5681, 0.4385], at: "right" },
    dark: { region: [0.3604, 0.2794, 0.5641, 0.4325], lens: { crop: [0.3564, 0.2734, 0.5681, 0.4385], at: "right" } },
  },
  {
    id: "ai",
    Icon: Bot,
    tile: "bg-orange-50 text-accent-strong",
    side: "left",
    slot: 2,
    shift: [-0.68, 0.61],
    region: [0.1442, 0.2794, 0.3478, 0.4325],
    lens: { crop: [0.1402, 0.2734, 0.3518, 0.4385], at: "below" },
    dark: { region: [0.1442, 0.2794, 0.3478, 0.4325], lens: { crop: [0.1402, 0.2734, 0.3518, 0.4385], at: "below" } },
  },
];

/** Message keys under "Hero.ticks". */
const HERO_TICKS = ["ai", "machines", "tally"] as const;

// Literal class names so Tailwind can see them.
const COL_START = { left: "lg:col-start-1", right: "lg:col-start-3" } as const;
const ROW_START = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"] as const;

/** The gradient product name; all names share one grid cell so the block never jumps. */
function ActiveProductName({ active }: { active: number }) {
  const tp = useTranslations("Products");
  return (
    <span className="mt-4 grid justify-items-center text-[0.78em] lg:mt-[clamp(0.625rem,1.8vh,1.25rem)]" aria-hidden="true">
      {HERO_PRODUCTS.map(({ id }, i) => (
        <span
          key={id}
          className={`col-start-1 row-start-1 w-fit bg-gradient-to-r from-violet-600 via-indigo-500 to-teal-500 bg-clip-text pb-1 text-transparent transition-all dark:bg-none dark:text-slate-900 duration-500 ${
            i === active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {tp(`${id}.name`)}
        </span>
      ))}
    </span>
  );
}

/** True while the page is in dark mode (`data-theme="dark"` on <html>, set by app/layout.tsx and the header switch). */
function useIsDark() {
  return useSyncExternalStore(
    (onChange) => {
      const mo = new MutationObserver(onChange);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => mo.disconnect();
    },
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false,
  );
}

/** Dot grid, soft light-orange glow and a navy / light-orange base line. Purely decorative. */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="synax-stars absolute inset-0" />
      <div className="absolute inset-0 [background-image:radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_35%,transparent_80%)]" />
      <div className="absolute top-12 left-1/2 aspect-square w-[40rem] -translate-x-1/2 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-solid" />
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
  const t = useTranslations("Hero");
  const tp = useTranslations("Products");
  const tb = useTranslations("Buttons");
  const [active, setActive] = useState(0);
  const dark = useIsDark();
  const [auto, setAuto] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
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
      const view = dark ? p.dark : p;
      const MW = dark ? DARK_MASTER_W : MASTER_W;
      const MH = dark ? DARK_MASTER_H : MASTER_H;
      const s = stage.getBoundingClientRect();
      const i = image.getBoundingClientRect();
      const c = chip.getBoundingClientRect();

      const [rx0, y0, rx1, y1] = view.region;
      const x0 = mapX(rx0);
      const x1 = mapX(rx1);
      const left = p.side === "left";
      const ax = (left ? c.right : c.left) - s.left;
      const ay = c.top + c.height / 2 - s.top;
      let tx = i.left - s.left + (left ? x0 : x1) * i.width;
      let ty = i.top - s.top + ((y0 + y1) / 2) * i.height;

      // Magnified pop-out of the active module, sized from the displayed image so it stays sharp at any width.
      const lensEl = lensRef.current;
      const frame = frameRef.current;
      if (lensEl && frame) {
        const f = frame.getBoundingClientRect();
        const W = i.width;
        const H = i.height;
        const sy = H / MH; // screen px per screenshot px
        const [cx0, cy0, cx1, cy1] = view.lens.crop;
        const cw = (cx1 - cx0) * MW;
        const ch = (cy1 - cy0) * MH;
        const spotL = x0 * W;
        const spotR = x1 * W;
        const spotT = y0 * H;
        const spotB = y1 * H;
        const room = view.lens.at === "right" ? W + POKE - (spotR + 10) : W + POKE;
        const w = Math.min(LENS_W * W, room);
        const z = w / (cw * sy);
        const h = ch * sy * z;
        let lx: number;
        let ly: number;
        if (view.lens.at === "right") {
          lx = spotR + 10;
          ly = (spotT + spotB) / 2 - h / 2;
        } else if (view.lens.at === "below") {
          lx = Math.min(spotL, W + POKE - w);
          ly = spotB + 8;
        } else {
          lx = W + POKE - w;
          ly = spotT - 8 - h;
        }
        ly = Math.max(-6, Math.min(ly, H - h + 10));
        const ox = i.left - (f.left + frame.clientLeft);
        const oy = i.top - (f.top + frame.clientTop);
        lensEl.style.left = `${ox + lx}px`;
        lensEl.style.top = `${oy + ly}px`;
        lensEl.style.width = `${w}px`;
        lensEl.style.height = `${h}px`;
        const pic = lensEl.firstElementChild as HTMLElement | null;
        if (pic) {
          pic.style.backgroundSize = `${MW * sy * z}px ${MH * sy * z}px`;
          pic.style.backgroundPosition = `${-cx0 * MW * sy * z}px ${-cy0 * MH * sy * z}px`;
        }
        if (!left) {
          // Right-hand cards connect to the lens (its right edge), so the line does not cross other modules.
          tx = i.left - s.left + lx + w;
          ty = i.top - s.top + ly + h / 2;
        }
      }
      const d = (tx - ax) / 2;

      path.setAttribute("d", `M${ax} ${ay} C${ax + d} ${ay} ${tx - d} ${ty} ${tx} ${ty}`);
      dot.setAttribute("cx", String(tx));
      dot.setAttribute("cy", String(ty));
    };

    draw();
    const stage = stageRef.current;
    const observer = stage ? new ResizeObserver(draw) : null;
    if (stage && observer) observer.observe(stage);
    // The cards' scatter follows the viewport width even when the stage itself does not resize.
    window.addEventListener("resize", draw);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [active, dark]);

  const pick = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  const [rawX0, ry0, rawX1, ry1] = (dark ? HERO_PRODUCTS[active].dark : HERO_PRODUCTS[active]).region;
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
            className="synax-enter [--enter-d:80ms] text-[2rem] leading-[1.08] font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[clamp(2rem,5vh,3rem)]"
          >
            <span className="block">
              {t.rich("headline", {
                em: (chunks) => (
                  <span className="relative inline-block">
                    {chunks}
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
                ),
              })}
            </span>
            {/* Screen readers get the full list once instead of a changing name. */}
            <span className="sr-only">: {HERO_PRODUCTS.map((p) => tp(`${p.id}.name`)).join(", ")}</span>
            <ActiveProductName active={active} />
          </h1>


          <div className="synax-enter [--enter-d:260ms] flex w-full flex-col items-stretch justify-center gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onScheduleDemo}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-solid px-5 py-2.5 text-[0.8125rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-solid-hover hover:shadow-md"
            >
              <span>{tb("scheduleDemo")}</span>
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
              <span>{tb("watchOverview")}</span>
            </button>
          </div>

          <ul className="synax-enter [--enter-d:400ms] flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[11.5px] text-slate-600 sm:text-xs">
            {HERO_TICKS.map((tick) => (
              <li key={tick} className="flex items-center gap-1.5">
                <CircleCheck className="size-4 shrink-0 text-orange-400" aria-hidden="true" />
                {t(`ticks.${tick}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Stage: dashboard in the middle, products on either side. Its width is capped by the viewport height
            on lg+, so the whole stage (and the CTAs below it) fits the first screen. */}
        <div
          ref={stageRef}
          className="synax-hero-visual relative order-1 mx-auto grid w-full gap-4 lg:max-w-[calc(37.6vh*2.1+2*var(--g)+3rem)] lg:grid-cols-[var(--g)_minmax(0,1fr)_var(--g)] lg:grid-rows-3 lg:gap-x-5 lg:gap-y-2 lg:[--g:9.5rem] xl:[--g:11.5rem]"
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
            <div className="absolute inset-x-5 top-6 bottom-[18px] rounded-2xl border border-brand-line/20 bg-blue-900/[0.07]" aria-hidden="true" />
            <div className="absolute inset-x-10 -bottom-1 h-4 rounded-[50%] bg-black/10 blur-md" aria-hidden="true" />

            <div
              ref={frameRef}
              className="relative rounded-2xl border border-slate-200 bg-surface p-1.5 shadow-[0_22px_44px_-20px_rgba(11,27,51,0.42)]"
            >
              <div ref={imageRef} className="relative overflow-hidden rounded-xl ring-1 ring-black/5">
                <Image
                  src="/images/hero-dashboard-v3.webp"
                  alt={t("dashboardAlt")}
                  width={1748}
                  height={1045}
                  priority
                  sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 50vw, 100vw"
                  className="block aspect-[1748/1045] w-full object-cover dark:hidden"
                  draggable={false}
                />
                <Image
                  src="/images/hero-dashboard-v3-dark.webp"
                  alt={t("dashboardAltDark")}
                  width={1748}
                  height={1045}
                  priority
                  sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 50vw, 100vw"
                  className="hidden aspect-[1748/1045] w-full object-cover dark:block"
                  draggable={false}
                />
                {/* The airplane, light sweeps and live dots (off for prefers-reduced-motion) */}
                <DashboardMotion banner={BANNER} haze={HAZE} />
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

              {/* Magnifier (lg+): the active module, enlarged from the full-size screenshot so its text is readable */}
              <div
                key={active}
                ref={lensRef}
                aria-hidden="true"
                className="synax-hero-lens pointer-events-none absolute z-20 hidden lg:block"
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-xl border-2 border-orange-400 bg-surface bg-[url(/images/hero-dashboard-v3-master.webp)] bg-origin-border bg-no-repeat shadow-[0_18px_36px_-12px_rgba(30,58,138,0.5)] dark:bg-[url(/images/hero-dashboard-v3-dark-master.webp)]"
                />
                <span className="absolute -top-2.5 -left-2.5 flex size-6 items-center justify-center rounded-full bg-orange-400 text-white shadow-sm ring-2 ring-surface">
                  <ZoomIn className="size-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* The six products (a grid below lg; placed beside the dashboard from lg) */}
          <ul
            aria-label={t("productsAria")}
            className="grid gap-2 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:contents"
          >
            {HERO_PRODUCTS.map((p, i) => {
              const on = i === active;
              return (
                <li
                  key={p.id}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  style={{ "--dx": p.shift[0], "--dy": p.shift[1] } as CSSProperties}
                  className={`flex lg:translate-x-[calc(var(--sp)*var(--dx))] lg:translate-y-[calc(var(--spy)*var(--dy))] lg:self-center ${COL_START[p.side]} ${ROW_START[p.slot]}`}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-surface/90 p-2 text-left shadow-[0_14px_28px_-10px_rgba(56,189,248,0.5),0_4px_10px_-4px_rgba(125,211,252,0.4)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
                      on
                        ? "-translate-y-0.5 border-orange-400 ring-1 ring-orange-400"
                        : "border-sky-100 hover:border-sky-200"
                    }`}
                  >
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${p.tile}`}>
                      <p.Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 hyphens-auto break-words">
                      <span className="block text-[11.5px] leading-tight font-semibold text-slate-900">{tp(`${p.id}.name`)}</span>
                      <span className="mt-0.5 hidden text-[11px] leading-tight text-slate-500 xl:block">
                        {tp(`${p.id}.menu`)}
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
