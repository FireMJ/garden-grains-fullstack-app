/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration (still valid)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image configuration
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  
  // Other valid options
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
