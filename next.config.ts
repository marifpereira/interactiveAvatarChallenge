import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    // Only add GLB support on client side to avoid SSR issues
    if (!isServer) {
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
      });
    }
    return config;
  },
  
  // Turbopack configuration for Next.js 16
  turbopack: {},
  
  // Experimental features to fix bootstrap issues
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;