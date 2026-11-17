import type { Metadata } from "next";
import { LegalPage } from "../../erp/_components/legal-page";
import { PRIVACY } from "../../erp/_data/legal";

export const metadata: Metadata = {
  title: `${PRIVACY.title} | Synax by Senwell`,
  description: PRIVACY.metaDescription,
  alternates: { canonical: "/privacy" },
  openGraph: { title: `${PRIVACY.title} | Synax`, description: PRIVACY.metaDescription, type: "article" },
};

/** /privacy: the text is in _data/legal.ts (copied from the portal), the layout in _components/legal-page.tsx. */
export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}
