import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Do not advertise the framework in every response.
  poweredByHeader: false,
  async headers() {
    // Safe baseline: stops the site being framed (the demo form could be clickjacked), content-type sniffing and
    // referrer leakage, switches off sensors we never use, and asks browsers to keep to HTTPS. A full script/style
    // Content-Security-Policy needs per-request nonces with this setup; add it as a separate, tested change.
    return [
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
