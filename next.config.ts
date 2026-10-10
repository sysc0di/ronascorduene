import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The root layout lives in the `[lang]` dynamic segment, so a sibling
     `not-found.tsx` cannot compose the site chrome for an URL that matches no
     route at all. `global-not-found` is the convention Next documents for this
     shape and is what renders the site's own 404 instead of the built-in one. */
  experimental: {
    globalNotFound: true,
  },
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
