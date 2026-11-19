/**
 * The public address of the site, without a trailing slash. Absolute URLs (canonical and hreflang links, Open Graph, the
 * sitemap) are built from it. Set NEXT_PUBLIC_SITE_URL to the real address (for example https://synax.senwellgroup.com) in
 * production; localhost is only the development fallback.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
