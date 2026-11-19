import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/i18n/seo";
import { SITE_URL } from "@/i18n/site";
import { INDUSTRY_PAGES } from "./erp/_data/industries";
import { PRODUCT_ROUTES } from "./erp/_data/products";

/**
 * /sitemap.xml: every page in every language, each entry listing its other-language versions (hreflang) so search engines
 * connect them. The paths are the English ones without a prefix; `localizedPath()` adds /fr or /de.
 *
 * Built from the same data that creates the pages (`PRODUCT_ROUTES`, `INDUSTRY_PAGES`), so a new product or solution page
 * appears here by itself. The legacy /cloud-erp-software/... address is left out on purpose (the real page is
 * /products/manufacturing-erp). No `lastModified`: a build-time date would claim a change that did not happen.
 */
const STATIC_PATHS = ["/", "/products", "/solutions", "/why-synax", "/security", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...PRODUCT_ROUTES.map((r) => `/products/${r.slug}`),
    ...INDUSTRY_PAGES.map((i) => `/solutions/${i.slug}`),
  ];
  const abs = (path: string, locale: (typeof routing.locales)[number]) => `${SITE_URL}${localizedPath(path, locale)}`;

  return paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(routing.locales.map((l) => [l, abs(path, l)]));
    languages["x-default"] = abs(path, routing.defaultLocale);
    return routing.locales.map((locale) => ({
      url: abs(path, locale),
      alternates: { languages },
      priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
    }));
  });
}
