import type { Metadata } from "next";
import { ProductPage } from "../../../erp/_components/product-page";
import { getLocale } from "next-intl/server";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";

/**
 * Legacy URL. It used to be a copy of another vendor's page (their brochure, video and "Why …"
 * headings, with no Synax styling). It now serves the Synax Manufacturing ERP page and points search
 * engines at the canonical /products/manufacturing-erp.
 */
const metadata: Metadata = {
  title: "Manufacturing ERP | Synax by Senwell",
  description:
    "Customer material, route cards, inspection, dispatch and invoicing in one traceable machine-to-invoice workflow.",
  alternates: { canonical: "/products/manufacturing-erp" },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return { ...metadata, alternates: localizedAlternates("/cloud-erp-software/manufacturing-management", locale) };
}

export default function ManufacturingManagementPage() {
  return <ProductPage productKey="precision" />;
}
