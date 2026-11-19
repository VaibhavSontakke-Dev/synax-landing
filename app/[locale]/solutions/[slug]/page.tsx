import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";
import { IndustryPageView } from "../../../erp/_components/industry-page";
import { IndustryPagePremium, PREMIUM_INDUSTRIES } from "../../../erp/_components/industry-page-premium";
import { INDUSTRY_PAGES, industryBySlug } from "../../../erp/_data/industries";

/** One page per industry from `_data/industries.ts`: /solutions/<slug>. Unknown slugs 404. */
export function generateStaticParams() {
  return INDUSTRY_PAGES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = industryBySlug(slug);
  if (!page) return {};
  const locale = (await getLocale()) as Locale;
  // The title and description are written per language in messages/*.json ("Industries.<slug>").
  const t = await getTranslations("Industries");
  const seoTitle = t(`${page.slug}.seoTitle`);
  const seoDescription = t(`${page.slug}.seoDescription`);
  return {
    title: `${seoTitle} | Synax by Senwell`,
    description: seoDescription,
    alternates: localizedAlternates(`/solutions/${page.slug}`, locale),
    openGraph: { title: `${seoTitle} | Synax`, description: seoDescription, type: "website" },
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
