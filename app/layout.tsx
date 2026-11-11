import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
  description:
    "From the machine spindle to the GST invoice in one workspace, with AI that chases your exceptions. Manufacturing ERP, work and delivery management, HRMS, staffing, shop-floor monitoring and AI. Free for SMEs under 50 employees.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Synax by Senwell | The ERP for Precision & Job-Work Manufacturers",
    description:
      "From the machine spindle to the GST invoice in one workspace, with AI that chases your exceptions. Free for SMEs under 50 employees.",
    type: "website",
    siteName: "Synax by Senwell",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
