import type { Metadata } from "next";
import { ProductPage } from "../../erp/_components/product-page";

/**
 * Legacy URL. It used to be a copy of another vendor's page (their brochure, video and "Why …"
 * headings, with no Synax styling). It now serves the Synax Manufacturing ERP page and points search
 * engines at the canonical /products/manufacturing-erp.
 */
export const metadata: Metadata = {
  title: "Manufacturing ERP | Synax by Senwell",
  description:
    "Customer material, route cards, inspection, dispatch and invoicing in one traceable machine-to-invoice workflow.",
  alternates: { canonical: "/products/manufacturing-erp" },
};

export default function ManufacturingManagementPage() {
  return <ProductPage productKey="precision" />;
}
