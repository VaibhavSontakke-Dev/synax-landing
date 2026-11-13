import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Do not advertise the framework in every response.
  poweredByHeader: false,
  images: {
    // Optimised files are cached for 30 days (the default is 4 hours, which made the server re-encode images far too
    // often). Keep every image under /public with a NEW file name when its content changes.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/webp"],
    // Fewer, sensible widths: each one is a separate file to generate and cache. Sources are at most 1920 px wide.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [70, 75],
  },
  async headers() {
    // Safe baseline: stops the site being framed (the demo form could be clickjacked), content-type sniffing and
    // referrer leakage, switches off sensors we never use, and asks browsers to keep to HTTPS. A full script/style
    // Content-Security-Policy needs per-request nonces with this setup; add it as a separate, tested change.
    // Files served straight from /public (not through the image optimiser) otherwise get "max-age=0", so every visit
    // re-checks them. A week of caching, then serve stale while refreshing, is safe because they change rarely.
    const longCache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }];
    return [
      { source: "/images/:path*", headers: longCache },
      { source: "/audio/:path*", headers: longCache },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Renamed from "IT Services & Project ERP".
        source: "/products/it-services-project-erp",
        destination: "/products/work-delivery-management",
        permanent: true,
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
