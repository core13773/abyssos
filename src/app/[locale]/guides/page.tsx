import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES } from '@/lib/data/guides';
import { routing } from '@/i18n/routing';

// 사이트 기준 URL (커스텀 도메인 우선, GitHub Pages 차선, 로컬 dev 폴백)
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';
  const title = isKo ? '공략 가이드' : 'Guides';
  const description = isKo
    ? '어비소스 공략 가이드 — 입문 가이드, 가디언 카드 공략, 3가지 모드 비교까지. 실제 게임 데이터에 기반한 단테 신곡 로그라이크 보드게임 공략.'
    : 'Abyssos guides — a beginner’s how-to-play guide, guardian card strategy and synergies, and a comparison of the three modes. Accurate to the real game data.';

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}/guides/`,
      languages: { 'x-default': `${siteUrl}/en/guides/`, en: `${siteUrl}/en/guides/`, ko: `${siteUrl}/ko/guides/` },
    },
    openGraph: {
      title: isKo ? '공략 가이드 — 어비소스' : 'Guides — Abyssos',
      description,
      url: `${siteUrl}/${locale}/guides/`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ko')) notFound();
  const isKo = locale === 'ko';

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-10 bg-stone-950 text-stone-300">
      {/* ItemList 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: isKo ? '홈' : 'Home', item: `${siteUrl}/${locale}/` },
              { '@type': 'ListItem', position: 2, name: isKo ? '공략' : 'Guides', item: `${siteUrl}/${locale}/guides/` },
            ],
          }),
        }}
      />

      {/* 헤더 */}
      <header className="text-center mb-6 sm:mb-8 z-10 pt-4 sm:pt-6 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 mb-2">
          {isKo ? '공략 가이드' : 'Guides'}
        </h1>
        <p className="text-sm sm:text-base text-stone-400 font-serif italic">
          {isKo
            ? '단테의 신곡을 통과하는 실전 공략'
            : 'Practical strategy for the Divine Comedy trilogy'}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Link
            href={`/${locale}/`}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← {isKo ? '홈' : 'Home'}
          </Link>
          <Link
            href={`/${isKo ? 'en' : 'ko'}/guides/`}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isKo ? '🇺🇸 English' : '🇰🇷 한국어'}
          </Link>
        </div>

        <p className="mt-5 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xl mx-auto">
          {isKo
            ? '어비소스는 단테의 신곡에서 영감을 받은 전략적 로그라이크 보드게임입니다. 아래 세 가이드는 실제 게임 데이터를 기반으로, 첫 판부터 3부작 클리어까지 필요한 모든 것을 다룹니다.'
            : 'Abyssos is a strategic roguelike board game inspired by Dante’s Divine Comedy. The three guides below are grounded in the real game data and cover everything from your first run to clearing the trilogy.'}
        </p>
      </header>

      {/* 가이드 카드 그리드 */}
      <section
        className="w-full max-w-2xl z-10 grid grid-cols-1 gap-3 sm:gap-4 pb-8"
        aria-label={isKo ? '가이드 목록' : 'Guide list'}
      >
        {GUIDES.map((g) => {
          const title = isKo ? g.cardTitle.ko : g.cardTitle.en;
          const excerpt = isKo ? g.cardExcerpt.ko : g.cardExcerpt.en;
          return (
            <Link
              key={g.slug}
              href={`/${locale}/guides/${g.slug}/`}
              className="group text-left rounded-2xl border border-stone-800 bg-stone-900/70 hover:bg-stone-900 hover:border-amber-700/40 transition-all p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-2xl sm:text-3xl" aria-hidden="true">{g.icon}</span>
                <h2 className={`text-lg sm:text-xl font-bold font-serif ${g.accent}`}>{title}</h2>
                <span
                  className="ml-auto text-stone-600 group-hover:text-amber-400 transition-colors"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">{excerpt}</p>
            </Link>
          );
        })}
      </section>

      {/* 플레이 CTA */}
      <section className="w-full max-w-2xl z-10 mb-8">
        <Link
          href={`/${locale}/game`}
          className="block w-full py-3 rounded-xl bg-amber-900/40 border border-amber-700/40 text-amber-300 text-sm font-bold hover:bg-amber-900/60 transition-colors text-center"
        >
          🔥 {isKo ? '어비소스 플레이하기' : 'Play Abyssos'}
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="text-stone-700 text-[10px] text-center pb-4 z-10 w-full max-w-2xl">
        <p className="font-serif italic">Abyssos Guides</p>
        <nav
          className="mt-2 flex flex-wrap items-center justify-center gap-2 text-stone-600"
          aria-label={isKo ? '법적 고지' : 'Legal'}
        >
          <span className="text-amber-600/80">{isKo ? '공략' : 'Guides'}</span>
          <span aria-hidden="true">·</span>
          <Link href={`/${locale}/privacy/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '개인정보처리방침' : 'Privacy'}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/${locale}/terms/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '이용약관' : 'Terms'}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/${locale}/contact/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '문의' : 'Contact'}
          </Link>
        </nav>
      </footer>
    </main>
  );
}
