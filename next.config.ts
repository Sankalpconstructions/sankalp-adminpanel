import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
 //  Ignore TypeScript errors during production build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable Turbopack properly or disable webpack warning
  turbopack: {},

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"], // keeps important logs
    },
  },
  // Added to allow testing on phone
  allowedDevOrigins: ["10.143.240.53"],
};

export default nextConfig;