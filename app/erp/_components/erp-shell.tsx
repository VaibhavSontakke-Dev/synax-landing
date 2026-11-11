import { Sora, Space_Grotesk } from "next/font/google";
import { DemoProvider } from "./demo-provider";
import { SiteNav } from "./site-nav";
import { Footer } from "./home-footer";

/**
 * The page frame shared by every Synax marketing route (/, /erp, /products/*, /solutions/*, …):
 * the `.erp-root` design-system scope with its fonts, the skip link, the announcement banner and
 * sticky header, the demo / tour modals, and the footer.
 *
 * Fonts are loaded here (not in the root layout) so the scaffold route keeps its own fonts. Each
 * route's layout.tsx just supplies its metadata and renders this around `children`.
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

export function ErpShell({ children }: { children: React.ReactNode }) {
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

      <DemoProvider>
        <SiteNav />
        <div id="main" className="flex-1 scroll-mt-24 bg-slate-50/70 text-slate-800 antialiased selection:bg-blue-900 selection:text-white">
          {children}
        </div>
        <Footer />
      </DemoProvider>
    </div>
  );
}
