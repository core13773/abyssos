import type { NextConfig } from "next";

/**
 * Environment variables (set via .env.local or CI secrets):
 *   NEXT_PUBLIC_BASE_PATH   — /abyssos for GitHub Pages, empty for local
 *   NEXT_PUBLIC_GA_ID       — Google Analytics 4 measurement ID (G-XXXXXXXXXX)
 *   NEXT_PUBLIC_ADSENSE_ID  — Google AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXX)
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath / assetPrefix injected by CI for production deploy
};
export default nextConfig;
