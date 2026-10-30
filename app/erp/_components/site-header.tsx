"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { NAV } from "../_data/content";
import { ChevronIcon } from "./icons";
import { Button, Container } from "./ui";

/**
 * Page-scoped header for /erp.
 *
 * Desktop dropdowns open on hover *and* on click, so pointer, keyboard and
 * touch all reach the same panels. Below `lg` the same tree renders as a
 * drawer with a scroll lock, Escape-to-close and focus returned to the toggle.
 */
export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  /* --- Condense the bar once the hero starts scrolling away --------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- Dropdown open/close ------------------------------------------------ */
  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    // Short grace period so a diagonal mouse path to the panel doesn't close it.
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  // Pointer outside the nav dismisses an open panel.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  /* --- Drawer: scroll lock, Escape, focus --------------------------------- */
  useEffect(() => {
    if (!mobileOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    drawerCloseRef.current?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [mobileOpen]);

  const closeDrawer = useCallback(() => {
    setMobileOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobileOpen) closeDrawer();
      else if (openMenu) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, openMenu, closeDrawer]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-erp ${
        scrolled
          ? "border-erp-line bg-white/92 shadow-erp-sm backdrop-blur-xl"
          : "border-transparent bg-white/75 backdrop-blur-md"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 rounded-erp-sm transition-opacity hover:opacity-80"
            aria-label="Synax by Senwell — back to top"
          >
            <img src="https://synax.senwellgroup.com/assets/logo/synax_logo.png" alt="Synax" className="h-8 w-auto lg:h-9" />
          </a>

          {/* ---------------- Desktop navigation ---------------- */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV.map((item) => {
              const isOpen = openMenu === item.label;

              if (!item.children) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="rounded-erp-sm px-3 py-2 text-sm font-medium text-erp-body transition-colors hover:text-erp-brand"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`erp-menu-${item.label}`}
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`flex items-center gap-1 rounded-erp-sm px-3 py-2 text-sm font-medium transition-colors ${
                      isOpen ? "text-erp-brand" : "text-erp-body hover:text-erp-brand"
                    }`}
                  >
                    {item.label}
                    <ChevronIcon
                      className={`size-4 transition-transform duration-300 ease-erp ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`erp-menu-${item.label}`}
                    className={`absolute top-full left-0 pt-3 transition-all duration-200 ease-erp ${
                      isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="w-[19rem] rounded-erp-lg border border-erp-line bg-white p-2 shadow-erp-lg">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            {...(child.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            tabIndex={isOpen ? undefined : -1}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-erp-md px-3 py-2.5 transition-colors hover:bg-erp-surface-3"
                          >
                            <span className="block text-sm font-semibold text-erp-ink">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-erp-soft">
                                {child.description}
                              </span>
                            ) : null}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* ---------------- Desktop actions ---------------- */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#modules"
              className="rounded-erp-sm px-3 py-2 text-sm font-medium text-erp-body transition-colors hover:text-erp-brand"
            >
              Modules
            </a>
            <Button href="#demo">Book a Demo</Button>
          </div>

          {/* ---------------- Mobile toggle ---------------- */}
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="erp-mobile-drawer"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-erp-md text-erp-ink lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden
              className="size-6"
            >
              <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
            </svg>
          </button>
        </div>
      </Container>

      {/* ---------------- Mobile drawer ---------------- */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-erp-navy/55 backdrop-blur-sm transition-opacity duration-300 ease-erp ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="erp-mobile-drawer"
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Site menu"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[22rem] flex-col bg-white shadow-erp-lg transition-transform duration-300 ease-erp ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-erp-line px-5">
            <img src="https://synax.senwellgroup.com/assets/logo/synax_logo.png" alt="Synax" className="h-8 w-auto" />
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={closeDrawer}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-erp-md text-erp-ink"
            >
              <span className="sr-only">Close menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                aria-hidden
                className="size-6"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
            <ul className="space-y-6">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    tabIndex={mobileOpen ? undefined : -1}
                    onClick={closeDrawer}
                    className="block py-1 text-base font-semibold text-erp-ink"
                  >
                    {item.label}
                  </a>
                  {item.children ? (
                    <ul className="mt-2 space-y-1 border-l border-erp-line pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            {...(child.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            tabIndex={mobileOpen ? undefined : -1}
                            onClick={closeDrawer}
                            className="block py-2 text-[0.9375rem] text-erp-body"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 space-y-3 border-t border-erp-line px-5 py-5">
            <Button
              href="#demo"
              size="lg"
              className="w-full"
              withArrow
              onNavigate={closeDrawer}
            >
              Book a Demo
            </Button>
            <Button
              href="#modules"
              variant="secondary"
              size="lg"
              className="w-full"
              onNavigate={closeDrawer}
            >
              Browse modules
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
