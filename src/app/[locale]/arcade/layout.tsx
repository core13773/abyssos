import type { Metadata } from 'next';

// Primary domain for production (custom domain), fallback for local dev
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';

  return {
    title: isKo ? '아케이드 — 어비소스' : 'Arcade — Abyssos',
    description: isKo
      ? '8종 게임을 한곳에서. 스택 타워, 플래피, 레인 닷지, 과일 합치기, 2048, 칼 던지기, 컬러 스위치, 그리고 어비소스 로그라이크.'
      : '8 games in one place: Stack Tower, Flappy, Lane Dodge, Merge Fruits, 2048, Knife Hit, Color Switch, and the Abyssos roguelike.',
    metadataBase: new URL(`${siteUrl}/${locale}/`),
    alternates: { canonical: `/${locale}/arcade/` },
    openGraph: {
      title: isKo ? '아케이드 — 어비소스' : 'Arcade — Abyssos',
      description: isKo
        ? '8종 게임을 한곳에서 플레이하세요.'
        : 'Play 8 games in one place.',
      url: `${siteUrl}/${locale}/arcade/`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: isKo ? '아케이드 — 어비소스' : 'Arcade — Abyssos',
      description: isKo ? '8종 게임을 한곳에서.' : '8 games in one place.',
    },
    robots: { index: true, follow: true },
  };
}

export default function ArcadeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
