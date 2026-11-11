"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCT_DATA, PRODUCT_ROUTES, type ProductRoute } from "../_data/products";
import { INDUSTRY_PAGES, industryHref } from "../_data/industries";
import { INDUSTRY_ICON } from "./industry-icons";
import { useDemo } from "./demo-provider";
import { TONE } from "./route-tone";

/**
 * Announcement banner + sticky header, shared by every page (landing, product, industry and content routes).
 *
 * All destinations are real links. The current page is read from the URL and shown three ways:
 * `aria-current="page"` on the link, a bold navy label with an orange underline in the bar, and a tinted
 * row inside the dropdowns. A dropdown trigger (Products, Industries) is marked too when you are on one of
 * its pages, so you can always tell where you are.
 */

const HOME = "/erp";

const SECTION_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Why Synax", href: "/why-synax" },
  { label: "Security & Trust", href: "/security" },
];

const MENU_PANEL =
  "absolute top-full -left-12 rounded-2xl border border-slate-200 bg-white/98 p-3 shadow-2xl backdrop-blur-xl opacity-0 translate-y-2 pointer-events-none transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100";

/** Bar link / dropdown trigger: bold navy + a light orange underline that draws in (see globals.css). */
const ACTIVE_BAR = "synax-nav-active font-bold text-blue-900";
const barClass = (active: boolean) => `transition-colors hover:text-blue-900 ${active ? ACTIVE_BAR : ""}`;

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
      {active ? <span className="synax-nav-here rounded-full border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700 uppercase">Here</span> : null}
    </Link>
  );
}

export function SiteNav() {
  const rawPath = usePathname();
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/$/, "") : rawPath;
  const { openDemo } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  const isHome = pathname === "/" || pathname === HOME;
  const onProducts = pathname === "/products" || pathname.startsWith("/products/");
  const onIndustries = pathname.startsWith("/solutions/");
  const isActive = (href: string) => pathname === href;
  const productHref = (r: ProductRoute) => `${r.base}/${r.slug}`;

  return (
    <>
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-4 py-2 text-[11px] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="rounded-full bg-orange-700 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
              Enterprise Ecosystem
            </span>
            <span className="hidden font-medium text-slate-300 sm:inline">
              A product of Senwell Group: the ERP for precision and job-work manufacturers
            </span>
            <span className="font-medium text-slate-300 sm:hidden">A product of Senwell Group</span>
          </div>
          <div className="flex shrink-0 items-center gap-4 font-mono text-[10px] text-slate-400">
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden="true" /> AS9100D QMS controls
            </span>
            <Link
              href={`${HOME}#senwell`}
              className="font-semibold text-orange-300 underline underline-offset-2 transition-colors hover:text-orange-200"
            >
              Senwell Pedigree &rarr;
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={HOME}
            onClick={close}
            aria-label="Synax by Senwell — home"
            className="group flex items-center rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/synax_logo.png"
              alt=""
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-9"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 text-xs font-semibold text-slate-600 lg:flex">
            <Link href={HOME} aria-current={isHome ? "page" : undefined} className={barClass(isHome)}>
              Overview
            </Link>

            <div className="group relative py-4">
              <button
                type="button"
                aria-haspopup="true"
                aria-current={onProducts ? "true" : undefined}
                className={`flex items-center gap-1 py-1 ${barClass(onProducts)}`}
              >
                Products ({PRODUCT_ROUTES.length})
                <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className={`${MENU_PANEL} w-96`}>
                <MenuLabel>Core Business Products</MenuLabel>
                {PRODUCT_ROUTES.slice(0, 2).map((r) => (
                  <MenuItem
                    key={r.key}
                    href={productHref(r)}
                    active={isActive(productHref(r))}
                    tone={r.tone}
                    Icon={PRODUCT_DATA[r.key].icon}
                    name={r.name}
                    menu={r.menu}
                  />
                ))}
                <MenuLabel className="mt-1 border-t border-slate-100 pt-2">Standalone & Add-On Products</MenuLabel>
                {PRODUCT_ROUTES.slice(2).map((r) => (
                  <MenuItem
                    key={r.key}
                    href={productHref(r)}
                    active={isActive(productHref(r))}
                    tone={r.tone}
                    Icon={PRODUCT_DATA[r.key].icon}
                    name={r.name}
                    menu={r.menu}
                  />
                ))}
                <Link
                  href="/products"
                  aria-current={pathname === "/products" ? "page" : undefined}
                  className={`mt-1 flex items-center justify-between rounded-xl border-t border-slate-100 px-3 pt-3 pb-1.5 text-xs font-bold text-blue-900 hover:underline ${pathname === "/products" ? "underline" : ""}`}
                >
                  Compare all products <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="group relative py-4">
              <button
                type="button"
                aria-haspopup="true"
                aria-current={onIndustries ? "true" : undefined}
                className={`flex items-center gap-1 py-1 ${barClass(onIndustries)}`}
              >
                Industries
                <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className={`${MENU_PANEL} -left-16 w-[410px]`}>
                <MenuLabel>Target Industry Sectors</MenuLabel>
                {INDUSTRY_PAGES.map((i) => (
                  <MenuItem
                    key={i.slug}
                    href={industryHref(i.slug)}
                    active={isActive(industryHref(i.slug))}
                    tone={i.tone}
                    Icon={INDUSTRY_ICON[i.icon]}
                    name={i.name}
                    menu={i.menu}
                  />
                ))}
              </div>
            </div>

            {SECTION_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link key={l.label} href={l.href} aria-current={active ? "page" : undefined} className={barClass(active)}>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => openDemo()}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md"
            >
              <span>Schedule a Demo</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div
            id="mobile-menu"
            className="max-h-[calc(100svh-6rem)] space-y-3 overflow-y-auto border-b border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden"
          >
            <MobileLink href={HOME} active={isHome} onClick={close} className="py-1 text-sm font-bold text-slate-900">
              Overview
            </MobileLink>

            <div className="space-y-1 border-l-2 border-blue-900 py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Core Business Products</div>
              {PRODUCT_ROUTES.slice(0, 2).map((r) => (
                <MobileLink key={r.key} href={productHref(r)} active={isActive(productHref(r))} onClick={close} className="py-1">
                  <span className={`block text-xs font-semibold ${TONE[r.tone].text}`}>Synax {r.name}</span>
                  <span className="block text-[10px] text-slate-500">{r.menu}</span>
                </MobileLink>
              ))}
            </div>

            <div className="space-y-1 border-l-2 border-orange-500 py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Standalone & Add-On Products
              </div>
              {PRODUCT_ROUTES.slice(2).map((r) => (
                <MobileLink key={r.key} href={productHref(r)} active={isActive(productHref(r))} onClick={close} className="py-1">
                  <span className={`block text-xs font-semibold ${TONE[r.tone].text}`}>Synax {r.name}</span>
                  <span className="block text-[10px] text-slate-500">{r.menu}</span>
                </MobileLink>
              ))}
              <MobileLink href="/products" active={pathname === "/products"} onClick={close} className="py-1 text-xs font-bold text-blue-900">
                Compare all products &rarr;
              </MobileLink>
            </div>

            <div className="space-y-1 border-l-2 border-emerald-500 py-1 pl-3">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Industries</div>
              {INDUSTRY_PAGES.map((i) => (
                <MobileLink
                  key={i.slug}
                  href={industryHref(i.slug)}
                  active={isActive(industryHref(i.slug))}
                  onClick={close}
                  className="py-1 text-xs font-semibold text-slate-700"
                >
                  {i.name}
                </MobileLink>
              ))}
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2 text-xs font-medium text-slate-700">
              {SECTION_LINKS.map((l) => (
                <MobileLink key={l.label} href={l.href} active={isActive(l.href)} onClick={close} className="py-1 text-slate-600">
                  {l.label}
                </MobileLink>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                openDemo();
                close();
              }}
              className="mt-2 w-full cursor-pointer rounded-xl bg-blue-900 py-3 text-xs font-semibold text-white shadow-md"
            >
              Schedule a Demo
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
