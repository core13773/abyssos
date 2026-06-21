import type { Metadata } from 'next';

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
    title: {
      default: isKo ? '플레이 — 어비소스' : 'Play — Abyssos',
      template: '%s | Abyssos',
    },
    description: isKo
      ? '지옥, 연옥, 천국 중 하나를 선택해 여정을 시작하세요. 주사위, 카드, 타이밍 배틀이 있는 전략적 로그라이크 보드게임.'
      : 'Start your journey through Inferno, Purgatorio, or Paradiso. A strategic roguelike board game with dice, cards, and timing battles.',
    metadataBase: new URL(`${siteUrl}/${locale}/`),
    alternates: {
      canonical: `/${locale}/game/`,
    },
    openGraph: {
      title: isKo ? '플레이 어비소스 — 신곡 3부작' : 'Play Abyssos — The Divine Comedy Trilogy',
      description: isKo
        ? '주사위를 굴리고 몬스터를 물리치며 심연에서 탈출하라.'
        : 'Roll dice, fight monsters, and escape the abyss.',
      url: `${siteUrl}/${locale}/game/`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: isKo ? '플레이 어비소스 — 신곡 3부작' : 'Play Abyssos — The Divine Comedy Trilogy',
      description: isKo ? '주사위를 굴리고 몬스터를 물리치며 심연에서 탈출하라.' : 'Roll dice, fight monsters, and escape the abyss.',
      creator: '@abyssos',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
