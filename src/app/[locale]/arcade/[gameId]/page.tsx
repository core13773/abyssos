import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARCADE_GAME_IDS, getArcadeGame } from '@/lib/data/arcadeGames';
import ArcadeGameClient from './ArcadeGameClient';

// Primary domain for production (custom domain), fallback for local dev
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

export function generateStaticParams() {
  return ARCADE_GAME_IDS.map((gameId) => ({ gameId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; gameId: string }>;
}): Promise<Metadata> {
  const { locale, gameId } = await params;
  const isKo = locale === 'ko';
  const g = getArcadeGame(gameId);
  if (!g) return {};
  const name = isKo ? g.nameKo : g.nameEn;
  const desc = isKo ? g.descKo : g.descEn;

  return {
    title: isKo ? `${name} — 아케이드` : `${name} — Arcade`,
    description: desc,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: `${siteUrl}/${locale}/arcade/${gameId}/` },
    openGraph: {
      title: name,
      description: desc,
      url: `${siteUrl}/${locale}/arcade/${gameId}/`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
    },
    twitter: { card: 'summary_large_image', title: name, description: desc },
    robots: { index: true, follow: true },
  };
}

export default async function ArcadeGamePage({
  params,
}: {
  params: Promise<{ locale: string; gameId: string }>;
}) {
  const { locale, gameId } = await params;
  const g = getArcadeGame(gameId);
  // abyssos 로그라이크는 /game 으로 진입하므로 아케이드 게임 정보 페이지에서는 제외
  if (!g || g.abyssos) notFound();
  return <ArcadeGameClient gameId={gameId} locale={locale} />;
}
