import type { RouteTone } from "../_data/products";

/**
 * Colours per product, matching the Products menu (green / navy / orange). One place so the header,
 * footer, product cards and product pages cannot drift apart.
 */
export const TONE: Record<
  RouteTone,
  { tile: string; text: string; hoverText: string; activeBg: string; chip: string; bar: string; check: string }
> = {
  emerald: {
    tile: "bg-emerald-50 text-emerald-600 border-emerald-200",
    text: "text-emerald-700",
    hoverText: "group-hover/item:text-emerald-700",
    activeBg: "bg-emerald-50/60",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "border-t-emerald-600",
    check: "text-emerald-600",
  },
  navy: {
    tile: "bg-slate-100 text-blue-900 border-slate-300",
    text: "text-blue-900",
    hoverText: "group-hover/item:text-blue-900",
    activeBg: "bg-slate-100/70",
    chip: "bg-slate-100 text-blue-900 border-slate-300",
    bar: "border-t-blue-900",
    check: "text-blue-900",
  },
  orange: {
    tile: "bg-orange-50 text-orange-700 border-orange-200",
    text: "text-orange-700",
    hoverText: "group-hover/item:text-orange-700",
    activeBg: "bg-orange-50/60",
    chip: "bg-orange-50 text-orange-700 border-orange-200",
    bar: "border-t-orange-600",
    check: "text-orange-600",
  },
};
