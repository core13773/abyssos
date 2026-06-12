import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // Primary domain for production (custom domain), fallback for local dev
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
    : process.env.NEXT_PUBLIC_BASE_PATH
      ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
      : 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/',
        '/api/',
        // Debug & test pages
        '/debug*.html',
        '/svg-test.html',
        '/test-*.html',
        '/card-preview.html',
        // SVGs used during development
        '/del-*.svg',
        '/step*.svg',
        '/test-*.svg',
        '/file.svg',
        '/globe.svg',
        '/next.svg',
        '/vercel.svg',
        '/window.svg',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
