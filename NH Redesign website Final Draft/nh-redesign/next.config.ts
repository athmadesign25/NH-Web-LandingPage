import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Allow local assets served from /public
  },
};

export default nextConfig;
