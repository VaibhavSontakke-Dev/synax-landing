import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "../../erp/_components/product-page";
import { PRODUCT_ROUTES, routeBySlug } from "../../erp/_data/products";

/** One page per product, from the registry in `_data/products.ts`: /products/<slug>. */
export function generateStaticParams() {
  return PRODUCT_ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = routeBySlug("/products", slug);
  if (!route) return {};
  return {
    title: `${route.seoTitle} | Synax by Senwell`,
    description: route.seoDescription,
    alternates: { canonical: `/products/${route.slug}` },
    openGraph: { title: `${route.seoTitle} | Synax`, description: route.seoDescription, type: "website" },
  };
}

export default async function ProductRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routeBySlug("/products", slug);
  if (!route) notFound();
  return <ProductPage productKey={route.key} />;
}
