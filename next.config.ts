import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/api/chat": [
      "./src/knowledge/biblia/BLivre/json/**/*.json",
      "./src/knowledge/biblia/**/*.md",
    ],
  },
};

export default nextConfig;
