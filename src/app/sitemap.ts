import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Primary domain for production (custom domain), fallback for local dev
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
    : process.env.NEXT_PUBLIC_BASE_PATH
      ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
      : 'http://localhost:3000';

  const pages = [
    { path: '/', priority: 1.0 },
    { path: '/ko/', priority: 1.0 },
    { path: '/en/', priority: 1.0 },
    { path: '/ko/game/', priority: 0.9 },
    { path: '/en/game/', priority: 0.9 },
    { path: '/ko/privacy/', priority: 0.5 },
    { path: '/en/privacy/', priority: 0.5 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en/`,
        en: `${baseUrl}/en/`,
        ko: `${baseUrl}/ko/`,
      },
    },
  }));
}
