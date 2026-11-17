import type { Metadata } from "next";
import { LegalPage } from "../../erp/_components/legal-page";
import { TERMS } from "../../erp/_data/legal";

export const metadata: Metadata = {
  title: `${TERMS.title} | Synax by Senwell`,
  description: TERMS.metaDescription,
  alternates: { canonical: "/terms" },
  openGraph: { title: `${TERMS.title} | Synax`, description: TERMS.metaDescription, type: "article" },
};

/** /terms: the text is in _data/legal.ts (copied from the portal), the layout in _components/legal-page.tsx. */
export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
