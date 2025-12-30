import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds (optional, but recommended to keep type checking)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
