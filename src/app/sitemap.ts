import type { MetadataRoute } from 'next';
import { ARCADE_GAME_IDS } from '@/lib/data/arcadeGames';
import { GUIDE_SLUGS } from '@/lib/data/guides';

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
    { path: '/ko/arcade/', priority: 0.8 },
    { path: '/en/arcade/', priority: 0.8 },
    { path: '/ko/guides/', priority: 0.8 },
    { path: '/en/guides/', priority: 0.8 },
    { path: '/ko/privacy/', priority: 0.5 },
    { path: '/en/privacy/', priority: 0.5 },
    { path: '/ko/terms/', priority: 0.4 },
    { path: '/en/terms/', priority: 0.4 },
    { path: '/ko/contact/', priority: 0.4 },
    { path: '/en/contact/', priority: 0.4 },
  ];

  // Arcade 게임별 페이지
  for (const id of ARCADE_GAME_IDS) {
    pages.push({ path: `/en/arcade/${id}/`, priority: 0.7 });
    pages.push({ path: `/ko/arcade/${id}/`, priority: 0.7 });
  }

  // 가이드 게재글 페이지
  for (const slug of GUIDE_SLUGS) {
    pages.push({ path: `/en/guides/${slug}/`, priority: 0.7 });
    pages.push({ path: `/ko/guides/${slug}/`, priority: 0.7 });
  }

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
