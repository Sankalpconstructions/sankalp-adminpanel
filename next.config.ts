import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Better logging in production
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;