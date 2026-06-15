import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "happilycooking.com" },
      { protocol: "https", hostname: "yummieliciouz.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "chefsbase.com" },
      { protocol: "https", hostname: "www.cubanacuisine.com" },
      { protocol: "https", hostname: "www.dashofjazz.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;  