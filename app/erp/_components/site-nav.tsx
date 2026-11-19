"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCT_DATA, PRODUCT_ROUTES, type ProductRoute } from "../_data/products";
import { SOLUTIONS, SOLUTION_GROUPS } from "../_data/solutions";
import { SOLUTION_ICON } from "./solution-icons";
import { useDemo } from "./demo-provider";
import { TONE } from "./route-tone";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Sticky header, shared by every page (landing, product, industry and content routes).
 *
 * All destinations are real links. The current page is read from the URL and shown three ways:
 * `aria-current="page"` on the link, a bold navy label with an orange underline in the bar, and a tinted
 * row inside the dropdowns. A dropdown trigger (Products, Solutions) is marked too when you are on one of
 * its pages, so you can always tell where you are.
 *
 * The Solutions menu lists the eight entries of _data/solutions.ts under the same three headings as the home
 * page section (Industries we serve / How you manufacture / Business needs), and ends with "See all solutions".
 * Entries without a page of their own link to their starting path on /solutions.
 */

const HOME = "/";

/** `key` is the message key in messages/*.json under "Nav". */
const SECTION_LINKS = [
  { key: "whySynax", href: "/why-synax" },
  { key: "security", href: "/security" },
] as const;

/** The Solutions panel is wider, so it is centred under its trigger instead of hanging off its left edge. */
const SOLUTIONS_PANEL_OFFSET = "left-1/2 -translate-x-1/2";

const MENU_PANEL =
  "absolute top-full -left-12 rounded-2xl border border-slate-200 bg-surface/98 p-3 shadow-2xl backdrop-blur-xl opacity-0 translate-y-2 pointer-events-none transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100";

const SOLUTIONS_PANEL = MENU_PANEL.replace("-left-12", SOLUTIONS_PANEL_OFFSET);

/** Bar link / dropdown trigger: bold navy + a light orange underline that draws in (see globals.css). */
const ACTIVE_BAR = "synax-nav-active font-bold text-brand";
const barClass = (active: boolean) => `transition-colors hover:text-brand ${active ? ACTIVE_BAR : ""}`;

function MenuLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase ${className}`}>
      {children}
    </div>
  );
}

function MenuItem({
  href,
  active,
  tone,
  Icon,
  name,
  menu,
}: {
  href: string;
  active: boolean;
  tone: keyof typeof TONE;
  Icon: LucideIcon;
  name: string;
  menu: string;
}) {
  const t = TONE[tone];
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 ${active ? `${t.activeBg} ring-1 ring-slate-200` : ""}`}
    >
      <span className={`rounded-lg border p-2 ${t.tile}`}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-xs font-bold text-slate-900 ${t.hoverText}`}>{name}</span>
        <span className="block text-[11px] text-slate-500">{menu}</span>
      </span>
      {active ? <span className="synax-nav-here rounded-full border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-accent-strong uppercase">Here</span> : null}
    </Link>
  );
}

/**
 * Which tint the header takes: the colours of the hero right under it (defined in globals.css, "Header tint").
 *   cream    home and the six product pages (page colour with the hero's faint orange glow)
 *   skyglow  /security, /why-synax, /solutions (sky hero with a glow)
 *   sky      /products, the legal pages and the IT Services page (plain sky gradient)
 *   paper    the Precision solution page (slate-50 hero)
 *   grey     the Workforce solution page (slate-100 hero)
 *   none     plain white, as before: the four solution pages with a dark photo hero, and the 404 page
 */
type HeaderTone = "cream" | "skyglow" | "sky" | "paper" | "grey" | "none";
function headerTone(path: string): HeaderTone {
  if (path === "/" || /^\/products\/[^/]+$/.test(path)) return "cream";
  if (path === "/security" || path === "/why-synax" || path === "/solutions") return "skyglow";
  if (path === "/products" || path === "/privacy" || path === "/terms" || path === "/solutions/it-services-staffing") return "sky";
  if (path === "/solutions/precision-cnc-machining") return "paper";
  if (path === "/solutions/plant-workforce-hcm") return "grey";
  return "none";
}

export function SiteNav() {
  const rawPath = usePathname();
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/$/, "") : rawPath;
  const { openDemo } = useDemo();
  const t = useTranslations("Nav");
  const tp = useTranslations("Products");
  const ts = useTranslations("Solutions");
  const tg = useTranslations("SolutionGroups");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setMobileOpen(false);

  // Once the page has scrolled, the tinted header gets a hairline and a little more body (see "Header tint" in globals.css).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === HOME;
  const tone = headerTone(pathname);
  // A same-page <Link> click doesn't scroll, so on the home page the logo / Overview link scroll to the top themselves.
  const homeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    close();
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const onProducts = pathname === "/products" || pathname.startsWith("/products/");
  const onSolutions = pathname === "/solutions" || pathname.startsWith("/solutions/");
  const isActive = (href: string) => pathname === href;
  const productHref = (r: ProductRoute) => `${r.base}/${r.slug}`;
  // Only a solution's own /solutions/<slug> page marks it as "Here" (Staffing's product page belongs to Products).
  const solutionActive = (href: string) => href.startsWith("/solutions/") && isActive(href);

  return (
    <>
      <header
        data-tone={tone}
        data-scrolled={scrolled ? "true" : "false"}
        className={`sticky top-0 z-40 backdrop-blur-md ${tone === "none" ? "border-b border-slate-200/80 bg-surface/90 shadow-xs" : "synax-header-tint"}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={HOME}
            onClick={homeClick}
            aria-label={t("homeAria")}
            className="group flex items-center rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-line"
          >
            {/* Colour logo on the light theme (a transparent copy, so the header tint shows around it), the white knockout on the dark theme. */}
            <Image
              src="/images/synax-pro-clear.webp"
              alt=""
              width={480}
              height={160}
              priority
              sizes="(min-width: 640px) 144px, 132px"
              className="-my-3 h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-12 dark:hidden"
            />
            <Image
              src="/images/synax-pro-light.webp"
              alt=""
              width={480}
              height={132}
              priority
              sizes="(min-width: 640px) 144px, 132px"
              className="hidden h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-10 dark:block"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 text-xs font-semibold text-slate-600 lg:flex">
            <Link href={HOME} onClick={homeClick} aria-current={isHome ? "page" : undefined} className={barClass(isHome)}>
              {t("overview")}
            </Link>

            <div className="group relative py-4">
              <button
                type="button"
                aria-haspopup="true"
                aria-current={onProducts ? "true" : undefined}
                className={`flex items-center gap-1 py-1 ${barClass(onProducts)}`}
              >
                {t("products", { count: PRODUCT_ROUTES.length })}
                <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className={`${MENU_PANEL} w-96`}>
                <MenuLabel>{t("coreProducts")}</MenuLabel>
                {PRODUCT_ROUTES.slice(0, 2).map((r) => (
                  <MenuItem
                    key={r.key}
                    href={productHref(r)}
                    active={isActive(productHref(r))}
                    tone={r.tone}
                    Icon={PRODUCT_DATA[r.key].icon}
                    name={tp(`${r.key}.name`)}
                    menu={tp(`${r.key}.menu`)}
                  />
                ))}
                <MenuLabel className="mt-1 border-t border-slate-100 pt-2">{t("addOnProducts")}</MenuLabel>
                {PRODUCT_ROUTES.slice(2).map((r) => (
                  <MenuItem
                    key={r.key}
                    href={productHref(r)}
                    active={isActive(productHref(r))}
                    tone={r.tone}
                    Icon={PRODUCT_DATA[r.key].icon}
                    name={tp(`${r.key}.name`)}
                    menu={tp(`${r.key}.menu`)}
                  />
                ))}
                <Link
                  href="/products"
                  aria-current={pathname === "/products" ? "page" : undefined}
                  className={`mt-1 flex items-center justify-between rounded-xl border-t border-slate-100 px-3 pt-3 pb-1.5 text-xs font-bold text-brand hover:underline ${pathname === "/products" ? "underline" : ""}`}
                >
                  {t("compareProducts")} <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="group relative py-4">
              <button
                type="button"
                aria-haspopup="true"
                aria-current={onSolutions ? "true" : undefined}
                className={`flex items-center gap-1 py-1 ${barClass(onSolutions)}`}
              >
                {t("solutions")}
                <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className={`${SOLUTIONS_PANEL} w-[640px]`}>
                <div className="grid grid-cols-2 gap-x-2">
                  {/* Left: industries. Right: how you manufacture, then business needs. */}
                  {[SOLUTION_GROUPS.slice(0, 1), SOLUTION_GROUPS.slice(1)].map((col, c) => (
                    <div key={c}>
                      {col.map((g, gi) => (
                        <div key={g.id}>
                          <MenuLabel className={gi > 0 ? "mt-2" : ""}>{tg(`${g.id}.label`)}</MenuLabel>
                          {SOLUTIONS.filter((s) => s.group === g.id).map((s) => (
                            <MenuItem
                              key={s.key}
                              href={s.href}
                              active={solutionActive(s.href)}
                              tone={s.tone}
                              Icon={SOLUTION_ICON[s.key]}
                              name={ts(`${s.key}.title`)}
                              menu={ts(`${s.key}.short`)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Link
                  href="/solutions"
                  aria-current={pathname === "/solutions" ? "page" : undefined}
                  className={`mt-1 flex items-center justify-between rounded-xl border-t border-slate-100 px-3 pt-3 pb-1.5 text-xs font-bold text-brand hover:underline ${pathname === "/solutions" ? "underline" : ""}`}
                >
                  {t("seeSolutions")} <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {SECTION_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link key={l.key} href={l.href} aria-current={active ? "page" : undefined} className={barClass(active)}>
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => openDemo()}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-brand-solid px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-solid-hover hover:shadow-md"
            >
              <span>{t("scheduleDemo")}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label={t("toggleMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-menu"
            className="max-h-[calc(100svh-6rem)] space-y-3 overflow-y-auto border-b border-slate-200 bg-surface px-4 py-4 shadow-xl lg:hidden"
          >
            <MobileLink href={HOME} active={isHome} onClick={close} className="py-1 text-sm font-bold text-slate-900">
              {t("overview")}
            </MobileLink>

            <div className="space-y-1 border-l-2 border-brand-line py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{t("coreProducts")}</div>
              {PRODUCT_ROUTES.slice(0, 2).map((r) => (
                <MobileLink key={r.key} href={productHref(r)} active={isActive(productHref(r))} onClick={close} className="py-1">
                  <span className={`block text-xs font-semibold ${TONE[r.tone].text}`}>Synax {tp(`${r.key}.name`)}</span>
                  <span className="block text-[10px] text-slate-500">{tp(`${r.key}.menu`)}</span>
                </MobileLink>
              ))}
            </div>

            <div className="space-y-1 border-l-2 border-orange-500 py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t("addOnProducts")}
              </div>
              {PRODUCT_ROUTES.slice(2).map((r) => (
                <MobileLink key={r.key} href={productHref(r)} active={isActive(productHref(r))} onClick={close} className="py-1">
                  <span className={`block text-xs font-semibold ${TONE[r.tone].text}`}>Synax {tp(`${r.key}.name`)}</span>
                  <span className="block text-[10px] text-slate-500">{tp(`${r.key}.menu`)}</span>
                </MobileLink>
              ))}
              <MobileLink href="/products" active={pathname === "/products"} onClick={close} className="py-1 text-xs font-bold text-brand">
                {t("compareProducts")} &rarr;
              </MobileLink>
            </div>

            <div className="space-y-1 border-l-2 border-emerald-500 py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{t("solutions")}</div>
              {SOLUTION_GROUPS.map((g) => (
                <div key={g.id} className="space-y-1 pt-1">
                  <div className="pl-3 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">{tg(`${g.id}.label`)}</div>
                  {SOLUTIONS.filter((s) => s.group === g.id).map((s) => (
                    <MobileLink
                      key={s.key}
                      href={s.href}
                      active={solutionActive(s.href)}
                      onClick={close}
                      className="py-1 text-xs font-semibold text-slate-700"
                    >
                      {ts(`${s.key}.title`)}
                    </MobileLink>
                  ))}
                </div>
              ))}
              <MobileLink href="/solutions" active={pathname === "/solutions"} onClick={close} className="py-1 text-xs font-bold text-brand">
                {t("seeSolutions")} &rarr;
              </MobileLink>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2 text-xs font-medium text-slate-700">
              {SECTION_LINKS.map((l) => (
                <MobileLink key={l.key} href={l.href} active={isActive(l.href)} onClick={close} className="py-1 text-slate-600">
                  {t(l.key)}
                </MobileLink>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                openDemo();
                close();
              }}
              className="mt-2 w-full cursor-pointer rounded-xl bg-brand-solid py-3 text-xs font-semibold text-white shadow-md"
            >
              {t("scheduleDemo")}
            </button>
          </div>
        )}
      </header>
    </>
  );
}

/** Mobile menu link: the current page gets an orange bar, bold text and aria-current. */
function MobileLink({
  href,
  active,
  onClick,
  className = "",
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`block rounded-md border-l-4 pl-2 ${active ? "synax-nav-slide border-orange-300 bg-orange-50/60 font-bold" : "border-transparent"} ${className}`}
    >
      {children}
    </Link>
  );
}
