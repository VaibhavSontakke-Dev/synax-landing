import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing, OG_LOCALE } from "@/i18n/routing";
import { SITE_URL } from "@/i18n/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Sets the theme before first paint so there is no flash: `data-theme` on <html> is "dark" or "light".
 * Saved choice (localStorage "synax.theme": "light" | "dark") wins; with nothing saved it follows the OS setting.
 * The header toggle (erp/_components/theme-toggle.tsx) reads and writes the same key.
 */
const THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("synax.theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);d.setAttribute("data-theme",dark?"dark":"light");}catch(e){d.setAttribute("data-theme","light");}})();`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
};

/**
 * Every language gets a page for each language in `routing.locales`, built ahead of time. (With Cache Components,
 * Next.js needs at least one value for each root parameter.)
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Site-wide metadata. The wording is still English in every language for now (phase 3 of internationalisation.md);
 * only `openGraph.locale` follows the language. Each page adds its own canonical + hreflang links (i18n/seo.ts).
 */
export async function generateMetadata(): Promise<Metadata> {
  const requested = await rootLocale();
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    metadataBase: new URL(SITE_URL),
    title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
    description:
      "From the machine to the GST invoice in one workspace, with AI that chases your exceptions. Manufacturing ERP, work and delivery management, HRMS, staffing, shop-floor monitoring and AI. Free for SMEs under 50 employees.",
    openGraph: {
      title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
      description:
        "From the machine to the GST invoice in one workspace, with AI that chases your exceptions. Free for SMEs under 50 employees.",
      type: "website",
      siteName: "Synax by Senwell",
      locale: OG_LOCALE[locale],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const requested = await rootLocale();
  // An unknown first segment (for example /xx/products) is not a language: show the 404 page.
  if (!hasLocale(routing.locales, requested)) notFound();

  return (
    <html
      lang={requested}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Hands the language and its messages to client components (useTranslations in "use client" files). */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
