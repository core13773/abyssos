import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

  return {
    name: 'Abyssos — The Divine Comedy Trilogy',
    short_name: 'Abyssos',
    description:
      'A strategic roguelike board game through Dante\'s 9 circles of Hell. Roll dice, fight monsters, defeat gatekeepers, and escape the abyss.',
    start_url: `${baseUrl}/ko/`,
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#1c1917',
    icons: [
      {
        src: `${baseUrl}/favicon.ico`,
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['games', 'entertainment'],
    lang: 'ko',
    dir: 'ltr',
  };
}
