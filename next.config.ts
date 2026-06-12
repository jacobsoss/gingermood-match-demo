import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode overlay button so local iPad testing looks clean.
  devIndicators: false,
  // The quiz is a product feature now — preserve pre-platform links (D9).
  async redirects() {
    return [
      { source: "/match", destination: "/dashboard/match", permanent: false },
      { source: "/quiz", destination: "/dashboard/match", permanent: false },
    ];
  },
};

export default nextConfig;
