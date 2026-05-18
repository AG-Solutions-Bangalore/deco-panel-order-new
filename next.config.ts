import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.146.140.27", "localhost"],
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://decopanel.in/public/api/:path*",
      },
      {
        source: "/api/fleet/:path*",
        destination: "https://dfcgroup.in/fleetapi/public/api/:path*",
      },
    ];
  },
};

export default nextConfig;
