/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // Add quality 90 to allowed qualities
    qualities: [25, 50, 75, 90, 100],
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
};

export default nextConfig;
