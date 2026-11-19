import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";
import { ErpShell } from "../erp/_components/erp-shell";
import Landingpage from "../erp/_components/landingpage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return { alternates: localizedAlternates("/", locale) };
}

/** The landing page lives at the site root (/erp redirects here, see next.config.ts); /fr and /de are its other languages. */
export default function Home() {
  return (
    <ErpShell>
      <Landingpage />
    </ErpShell>
  );
}
