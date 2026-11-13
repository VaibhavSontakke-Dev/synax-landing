import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPageView } from "../../erp/_components/industry-page";
import { IndustryPagePremium, PREMIUM_INDUSTRIES } from "../../erp/_components/industry-page-premium";
import { INDUSTRY_PAGES, industryBySlug } from "../../erp/_data/industries";

/** One page per industry from `_data/industries.ts`: /solutions/<slug>. Unknown slugs 404. */
export function generateStaticParams() {
  return INDUSTRY_PAGES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = industryBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.seoTitle} | Synax by Senwell`,
    description: page.seoDescription,
    alternates: { canonical: `/solutions/${page.slug}` },
    openGraph: { title: `${page.seoTitle} | Synax`, description: page.seoDescription, type: "website" },
  };
}

export default async function IndustryRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = industryBySlug(slug);
  if (!page) notFound();
  // The redesigned layout is rolled out industry by industry; the rest keep the standard template.
  if (PREMIUM_INDUSTRIES.has(page.slug)) return <IndustryPagePremium page={page} />;
  return <IndustryPageView page={page} />;
}
