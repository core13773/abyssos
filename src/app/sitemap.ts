import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          ko: baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/game`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/game`,
          ko: `${baseUrl}/game`,
        },
      },
    },
  ];
}
