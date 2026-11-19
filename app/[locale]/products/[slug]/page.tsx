import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";
import { AiBiPage } from "../../../erp/_components/product-pages/ai-bi";
import { HrmsPage } from "../../../erp/_components/product-pages/hrms";
import { ManufacturingErpPage } from "../../../erp/_components/product-pages/manufacturing-erp";
import { ShopFloorPage } from "../../../erp/_components/product-pages/shop-floor";
import { StaffingPage } from "../../../erp/_components/product-pages/staffing";
import { WorkDeliveryPage } from "../../../erp/_components/product-pages/work-delivery";
import { PRODUCT_ROUTES, routeBySlug, type ProductKey } from "../../../erp/_data/products";

/** Each product has its own page layout (see erp/_components/product-pages). */
const PAGES: Partial<Record<ProductKey, () => React.ReactElement>> = {
  precision: ManufacturingErpPage,
  it: WorkDeliveryPage,
  hrms: HrmsPage,
  staffing: StaffingPage,
  shopfloor: ShopFloorPage,
  ai: AiBiPage,
};

/** One page per product, from the registry in `_data/products.ts`: /products/<slug>. */
export function generateStaticParams() {
  return PRODUCT_ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = routeBySlug("/products", slug);
  if (!route) return {};
  const locale = (await getLocale()) as Locale;
  // Written per language in messages/*.json ("ProductMeta.<key>"); the English text in products.ts is no longer shown.
  const t = await getTranslations("ProductMeta");
  const seoTitle = t(`${route.key}.seoTitle`);
  const seoDescription = t(`${route.key}.seoDescription`);
  return {
    title: `${seoTitle} | Synax by Senwell`,
    description: seoDescription,
    alternates: localizedAlternates(`/products/${route.slug}`, locale),
    openGraph: { title: `${seoTitle} | Synax`, description: seoDescription, type: "website" },
  };
}

export default async function ProductRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routeBySlug("/products", slug);
  const Page = route ? PAGES[route.key] : undefined;
  if (!Page) notFound();
  return <Page />;
}
