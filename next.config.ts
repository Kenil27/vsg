import type { NextConfig } from "next";

/** Static export for Firebase Hosting (`out/`). */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
