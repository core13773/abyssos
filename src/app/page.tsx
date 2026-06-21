import type { Metadata } from 'next';
import RootRedirect from './RootRedirect';

// 사이트 기준 URL — 커스텀 도메인 우선, 로컬 dev 폴백
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : 'http://localhost:3000';

// 루트 `/` 의 정규(canonical) 버전은 영문 메인 페이지(/en/)이다.
// 이 메타데이터는 루트가 영문 사이트의 진입점임을 검색엔진에 명시한다.
export const metadata: Metadata = {
  title: 'Abyssos — The Divine Comedy Trilogy',
  description:
    "A strategic roguelike board game through Dante's 9 circles of Hell. Roll dice, fight monsters, defeat gatekeepers, and escape the abyss. Free to play in your browser.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: `${siteUrl}/en/`,
    languages: {
      'x-default': `${siteUrl}/en/`,
      en: `${siteUrl}/en/`,
      ko: `${siteUrl}/ko/`,
    },
  },
  openGraph: {
    title: 'Abyssos — The Divine Comedy Trilogy',
    description:
      'Roll dice, fight monsters, and escape the abyss. A free browser-based roguelike board game inspired by Dante.',
    url: `${siteUrl}/en/`,
    siteName: 'Abyssos',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abyssos — The Divine Comedy Trilogy',
    description: 'A strategic roguelike board game through the 9 circles of Hell.',
  },
  robots: { index: true, follow: true },
};

export default function RootPage() {
  return <RootRedirect />;
}
