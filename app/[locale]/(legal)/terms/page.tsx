import type { Metadata } from "next";
import { LegalPage } from "../../../erp/_components/legal-page";
import { TERMS } from "../../../erp/_data/legal";
import { getLocale } from "next-intl/server";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";

const metadata: Metadata = {
  title: `${TERMS.title} | Synax by Senwell`,
  description: TERMS.metaDescription,
  alternates: { canonical: "/terms" },
  openGraph: { title: `${TERMS.title} | Synax`, description: TERMS.metaDescription, type: "article" },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return { ...metadata, alternates: localizedAlternates("/terms", locale) };
}

/** /terms: the text is in _data/legal.ts (copied from the portal), the layout in _components/legal-page.tsx. */
export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
