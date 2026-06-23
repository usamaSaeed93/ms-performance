import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript checking during build
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/services/servicing",
        destination: "/services/turbo-upgrades",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
