import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
  description:
    "From the machine to the GST invoice in one workspace, with AI that chases your exceptions. Manufacturing ERP, work and delivery management, HRMS, staffing, shop-floor monitoring and AI. Free for SMEs under 50 employees.",
  openGraph: {
    title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
    description:
      "From the machine to the GST invoice in one workspace, with AI that chases your exceptions. Free for SMEs under 50 employees.",
    type: "website",
    siteName: "Synax by Senwell",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
