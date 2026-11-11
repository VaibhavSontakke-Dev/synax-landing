"use client";

import { ArrowRight, Play } from "lucide-react";
import { useDemo } from "./demo-provider";

/**
 * The two hero-style action buttons for server-rendered pages: "Schedule a Demo" (solid navy, or
 * white on dark) and "Watch overview" (2px orange outline with the play chip). They need the modal
 * context, so they are the only client code a product page ships.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

export function DemoButton({
  product,
  children = "Schedule a Demo",
  onDark = false,
  className = "",
}: {
  product?: string;
  children?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  const { openDemo } = useDemo();
  const colours = onDark
    ? "bg-white text-blue-900 hover:bg-orange-50"
    : "bg-blue-900 text-white shadow-md hover:bg-blue-800";
  return (
    <button
      type="button"
      onClick={() => openDemo(product)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${colours} ${FOCUS} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  );
}

export function TourButton({
  title,
  children = "Watch overview",
  onDark = false,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  const { openTour } = useDemo();
  return (
    <button
      type="button"
      onClick={() => openTour(title)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-orange-500 px-5 py-2.5 text-sm font-semibold transition-colors ${
        onDark ? "text-white hover:bg-orange-500/10" : "bg-white text-slate-800 hover:bg-orange-50"
      } ${FOCUS} ${className}`}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full ${onDark ? "bg-white/15 text-slate-200" : "bg-slate-200 text-slate-600"}`}
        aria-hidden="true"
      >
        <Play className="size-3 fill-current" />
      </span>
      <span>{children}</span>
    </button>
  );
}
