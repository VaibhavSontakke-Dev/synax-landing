import { Sora, Space_Grotesk } from "next/font/google";
import { useTranslations } from "next-intl";
import { DemoProvider } from "./demo-provider";
import { SiteNav } from "./site-nav";
import { Footer } from "./home-footer";
import { ChatWidget } from "./chat-support/chat-widget";
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
  const t = useTranslations("Common");
  return (
    <div
      className={`${sora.variable} ${spaceGrotesk.variable} erp-root flex min-h-screen flex-1 flex-col bg-erp-surface`}
    >
      {/* Without JS the IntersectionObserver never runs, so un-hide everything. */}
      <noscript>
        <style>{`.erp-root .erp-reveal{opacity:1!important;transform:none!important}.erp-root [data-anim],.erp-root [data-anim-stagger]>*{opacity:1!important}`}</style>
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-erp-md focus:bg-erp-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t("skipToContent")}
      </a>

      <DemoProvider>
        <SiteNav />
        <div id="main" className="flex-1 scroll-mt-24 bg-slate-50/70 text-slate-800 antialiased selection:bg-brand-solid selection:text-white">
          {children}
        </div>
        <Footer />
        {/* Chat support (dummy answers for now): launcher bottom-right on every page */}
        <ChatWidget />
      </DemoProvider>
    </div>
  );
}
