import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? "/portal-manajemen-arang" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/portal-manajemen-arang/" : "",
  trailingSlash: true
};
export default nextConfig;