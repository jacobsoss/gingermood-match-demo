import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode overlay button so local iPad testing looks clean.
  devIndicators: false,
};

export default nextConfig;
