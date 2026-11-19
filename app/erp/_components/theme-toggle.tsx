"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Light / dark switch for the header. One button: it shows the theme you would switch TO (a moon in light mode,
 * a sun in dark mode).
 *
 * The theme is the `data-theme` attribute on <html> ("light" | "dark"); the inline script in app/layout.tsx sets it
 * before first paint from localStorage "synax.theme" (or the OS setting when nothing is saved). Clicking saves the
 * choice and updates the attribute. The button also follows the OS setting while no choice is saved, and other
 * tabs through the `storage` event. Storage access is wrapped in try/catch (private windows, blocked storage).
 */

const KEY = "synax.theme";
const EVENT = "synax-theme-change";

function systemPrefersDark() {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function saved(): "light" | "dark" | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const onSystem = () => {
    // Only follow the OS while the visitor has not chosen.
    if (saved() === null) {
      apply(mq?.matches ? "dark" : "light");
      onChange();
    }
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      apply(saved() ?? (systemPrefersDark() ? "dark" : "light"));
      onChange();
    }
  };
  mq?.addEventListener("change", onSystem);
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq?.removeEventListener("change", onSystem);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, onChange);
  };
}

const getSnapshot = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerSnapshot = () => false;

export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const t = useTranslations("Theme");
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page view only */
    }
    apply(next);
    window.dispatchEvent(new Event(EVENT));
  };

  const label = dark ? t("toLight") : t("toDark");
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-700 transition-colors hover:border-orange-300 hover:bg-slate-100 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${withLabel ? "px-3 py-2 text-sm font-semibold" : "size-9"} ${className}`}
    >
      {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
      {withLabel ? <span>{dark ? t("light") : t("dark")}</span> : null}
    </button>
  );
}
