import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // only if you need to allow cross-origin calls:
      // allowedOrigins: ["https://my-proxy.com"],

      // to bump the 1 MB default request-body limit:
      // bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
