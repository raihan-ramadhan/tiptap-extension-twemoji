import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ofqhpepsytodemxfrhrc.supabase.co",
        pathname: "/storage/v1/object/public/emojis/**",
      },
    ],
  },
};

export default nextConfig;
