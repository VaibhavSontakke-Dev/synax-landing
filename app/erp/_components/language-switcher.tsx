"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";

/**
 * Language switcher for the header: a globe button that shows the current language and opens a short list.
 *
 * Each choice is a real link to the SAME page in the other language (`<Link href={pathname} locale="fr">`), so it works
 * without JavaScript, can be opened in a new tab, and search engines can follow it. next-intl also remembers the choice in
 * a cookie (NEXT_LOCALE), so a returning visitor lands in the language they picked.
 * The language names are written in their own language and are not translated.
 */
export function LanguageSwitcher() {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const pathname = usePathname(); // without the language prefix, e.g. "/products/staffing"
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Close on a click outside or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t("switchTo")}: ${LOCALE_NAMES[current]}`}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-surface px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="uppercase">{current}</span>
        <ChevronDown className={`size-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          aria-label={t("label")}
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-surface p-1 shadow-xl"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                lang={l}
                aria-current={l === current ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-slate-100 ${
                  l === current ? "font-bold text-brand" : "font-medium text-slate-700"
                }`}
              >
                {LOCALE_NAMES[l]}
                {l === current ? <Check className="size-3.5" aria-hidden="true" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
