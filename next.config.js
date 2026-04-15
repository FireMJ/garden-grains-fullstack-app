/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // This bypasses Next.js image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
