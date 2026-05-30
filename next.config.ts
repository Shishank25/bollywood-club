import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '147.79.70.30.nip.io',
        port: '8990',
        pathname: '/**', // Allows all paths under this domain
      },
    ],
  },
};

export default nextConfig;
