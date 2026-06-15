import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'openapi.animal.go.kr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openapi.animal.go.kr',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
