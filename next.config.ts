import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
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
