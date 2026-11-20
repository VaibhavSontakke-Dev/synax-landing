/**
 * The public address of the site, without a trailing slash. Absolute URLs (canonical and hreflang links, Open Graph, the
 * sitemap) are built from it. Set NEXT_PUBLIC_SITE_URL to the real address (for example https://synax.senwellgroup.com) in
 * production. Without it, a Vercel build uses the project's production domain (VERCEL_PROJECT_PRODUCTION_URL, set by
 * Vercel), so link previews (Teams, WhatsApp, LinkedIn) still get a reachable og:image. localhost is only the local
 * development fallback.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000")
).replace(/\/$/, "");
