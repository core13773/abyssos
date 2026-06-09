import type { NextConfig } from "next";

/**
 * Environment variables (set via .env.local or CI secrets):
 *   NEXT_PUBLIC_BASE_PATH   — /abyssos for GitHub Pages, empty for local
 *   NEXT_PUBLIC_GA_ID       — Google Analytics 4 measurement ID (G-XXXXXXXXXX)
 *   NEXT_PUBLIC_ADSENSE_ID  — Google AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXX)
 */
const nextConfig: NextConfig = {
  // For GitHub Pages deployment, uncomment:
  // output: 'export',
  // basePath: '/abyssos',
  // assetPrefix: '/abyssos',
  // images: { unoptimized: true },
};
export default nextConfig;
