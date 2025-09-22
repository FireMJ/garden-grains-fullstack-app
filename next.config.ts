// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // your other experimental flags here…
    serverActions: true,
  },
  // any other top-level config (image domains, rewrites, etc.)
};

export default nextConfig;
