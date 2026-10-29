import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";

/**
 * The live Synax site sets headings in Space Grotesk and everything else in
 * Sora. Both are loaded here rather than in the root layout so the scaffold
 * route keeps its own fonts and downloads none of these.
 */
const sora = Sora({
  variable: "--font-erp-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-erp-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synax ERP | Aerospace & Defense, Precision Manufacturing, IT Services",
  description:
    "Industry-focused ERP for aerospace and defense, precision manufacturing and IT services. Stage-level quality gates, AS9100D QMS controls and full traceability in one connected platform.",
  openGraph: {
    title: "Synax ERP — Precision, Performance & Control",
    description:
      "Connect operations, projects, production and resources with an ERP built for regulated manufacturing and services delivery.",
    type: "website",
  },
};

/**
 * Route-scoped layout for /erp.
 *
 * Nests inside the root layout, so no <html> or <body> here. Everything is
 * wrapped in `.erp-root`, which is the only selector the page's design system
 * attaches to — no style defined for this page can reach another route.
 */
export default function ErpLayout({ children }: LayoutProps<"/erp">) {
  return (
    <div
      className={`${sora.variable} ${spaceGrotesk.variable} erp-root flex min-h-screen flex-1 flex-col bg-erp-surface`}
    >
      {/* Without JS the IntersectionObserver never runs, so un-hide everything. */}
      <noscript>
        <style>{`.erp-root .erp-reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-erp-md focus:bg-erp-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {children}
    </div>
  );
}
