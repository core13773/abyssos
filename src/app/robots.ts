import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/', '/debug', '/debug2.html', '/debug3.html', '/debug4.html', '/debug5.html', '/debug6.html', '/debug7.html', '/debug8.html', '/debug9.html', '/debug10.html', '/debug11.html', '/debug-svg.html', '/svg-test.html', '/test-img.html', '/card-preview.html'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
