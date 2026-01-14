import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.201.87.180:8080/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://43.201.87.180:8080/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
