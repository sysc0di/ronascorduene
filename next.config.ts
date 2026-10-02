import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* The admin can paste any image URL, so allow remote hosts instead of
       crashing the storefront with "unconfigured host" errors. */
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
