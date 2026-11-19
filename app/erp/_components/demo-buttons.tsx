"use client";

import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDemo } from "./demo-provider";

/**
 * The two hero-style action buttons for server-rendered pages: "Schedule a Demo" (solid navy, or
 * white on dark) and "Watch overview" (2px orange outline with the play chip). They need the modal
 * context, so they are the only client code a product page ships.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

export function DemoButton({
  product,
  children,
  onDark = false,
  className = "",
}: {
  product?: string;
  children?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  const t = useTranslations("Buttons");
  const { openDemo } = useDemo();
  const colours = onDark
    ? "bg-surface text-brand hover:bg-orange-50"
    : "bg-brand-solid text-white shadow-md hover:bg-brand-solid-hover";
  return (
    <button
      type="button"
      onClick={() => openDemo(product)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${colours} ${FOCUS} ${className}`}
    >
      <span>{children ?? t("scheduleDemo")}</span>
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  );
}

export function TourButton({
  title,
  children,
  onDark = false,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  const t = useTranslations("Buttons");
  const { openTour } = useDemo();
  return (
    <button
      type="button"
      onClick={() => openTour(title)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-orange-500 px-5 py-2.5 text-sm font-semibold transition-colors ${
        onDark ? "text-white hover:bg-orange-500/10" : "bg-surface text-slate-800 hover:bg-orange-50"
      } ${FOCUS} ${className}`}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full ${onDark ? "bg-white/15 text-slate-200" : "bg-slate-200 text-slate-600"}`}
        aria-hidden="true"
      >
        <Play className="size-3 fill-current" />
      </span>
      <span>{children ?? t("watchOverview")}</span>
    </button>
  );
}
