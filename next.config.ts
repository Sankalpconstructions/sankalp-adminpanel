import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Enable Turbopack properly or disable webpack warning
  turbopack: {},

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;