import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, GUIDE_SLUGS, getGuide } from '@/lib/data/guides';
import { routing } from '@/i18n/routing';

// 사이트 기준 URL (커스텀 도메인 우선, GitHub Pages 차선, 로컬 dev 폴백)
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'http://localhost:3000';

export function generateStaticParams() {
  // 모든 로케일 × 모든 슬러그 조합을 정적으로 내보냄
  return routing.locales.flatMap((locale) =>
    GUIDE_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const isKo = locale === 'ko';
  const c = isKo ? guide.content.ko : guide.content.en;
  const canonical = `${siteUrl}/${locale}/guides/${slug}/`;

  return {
    title: c.title,
    description: c.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        'x-default': `${siteUrl}/en/guides/${slug}/`,
        en: `${siteUrl}/en/guides/${slug}/`,
        ko: `${siteUrl}/ko/guides/${slug}/`,
      },
    },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `${siteUrl}${canonical}`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'article',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
      publishedTime: '2026-06-21',
      authors: ['Abyssos'],
      images: [
        {
          url: `${siteUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: c.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: [`${siteUrl}/images/og-image.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ko')) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();

  const isKo = locale === 'ko';
  const c = isKo ? guide.content.ko : guide.content.en;
  const canonical = `/${locale}/guides/${slug}/`;

  // Article JSON-LD + BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: c.title,
        description: c.description,
        datePublished: '2026-06-21',
        dateModified: '2026-06-21',
        author: { '@type': 'Organization', name: 'Abyssos' },
        publisher: { '@type': 'Organization', name: 'Abyssos' },
        inLanguage: isKo ? 'ko' : 'en',
        image: `${siteUrl}/images/og-image.png`,
        mainEntityOfPage: `${siteUrl}${canonical}`,
        about: {
          '@type': 'VideoGame',
          name: 'Abyssos',
          url: `${siteUrl}/${locale}/`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isKo ? '홈' : 'Home', item: `${siteUrl}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: isKo ? '공략' : 'Guides', item: `${siteUrl}/${locale}/guides/` },
          { '@type': 'ListItem', position: 3, name: c.title, item: `${siteUrl}${canonical}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-300 px-4 py-8 sm:py-10 max-w-2xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 상단 네비 */}
      <nav
        className="flex items-center gap-3 text-xs mb-6"
        aria-label={isKo ? '이동 경로' : 'Breadcrumb'}
      >
        <Link
          href={`/${locale}/guides/`}
          className="text-stone-500 hover:text-amber-400 transition-colors"
        >
          ← {isKo ? '공략으로' : 'Back to guides'}
        </Link>
        <span aria-hidden="true" className="text-stone-700">/</span>
        <Link href={`/${locale}/`} className="text-stone-500 hover:text-amber-400 transition-colors">
          {isKo ? '홈' : 'Home'}
        </Link>
      </nav>

      {/* 기사 헤더 */}
      <header className="mb-8 border-b border-stone-800 pb-6">
        <p className="text-amber-600/70 text-xs tracking-[0.2em] uppercase font-serif italic mb-2">
          {guide.icon} {c.kicker}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400 mb-3 leading-tight">
          {c.title}
        </h1>
        <p className="text-sm text-stone-500">
          {isKo ? '어비소스 · ' : 'Abyssos · '}
          <time dateTime="2026-06-21">{isKo ? '2026년 6월 21일' : 'June 21, 2026'}</time>
        </p>
      </header>

      {/* 리드 */}
      <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 font-serif italic border-l-2 border-amber-700/50 pl-4">
        {c.lead}
      </p>

      {/* 본문 */}
      <article className="space-y-8">
        {c.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-400 mb-3">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, j) => (
              <p key={j} className="text-sm sm:text-base text-stone-400 leading-relaxed mb-3">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-2 space-y-2">
                {section.list.map((item, k) => (
                  <li
                    key={k}
                    className="text-sm sm:text-base text-stone-400 leading-relaxed flex gap-2"
                  >
                    <span className="text-amber-600 mt-1 shrink-0" aria-hidden="true">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      {/* 같은 카테고리의 다른 가이드 */}
      <section className="mt-12 pt-8 border-t border-stone-800">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">
          {isKo ? '다른 가이드' : 'More guides'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => {
            const t = isKo ? g.cardTitle.ko : g.cardTitle.en;
            return (
              <Link
                key={g.slug}
                href={`/${locale}/guides/${g.slug}/`}
                className="rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-900 hover:border-amber-700/40 transition-all p-3"
              >
                <span className="text-lg mr-1.5" aria-hidden="true">{g.icon}</span>
                <span className={`text-sm font-bold ${g.accent}`}>{t}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="mt-8 flex flex-col sm:flex-row gap-2">
        <Link
          href={`/${locale}/game`}
          className="flex-1 py-3 rounded-xl bg-amber-900/40 border border-amber-700/40 text-amber-300 text-sm font-bold hover:bg-amber-900/60 transition-colors text-center"
        >
          🔥 {isKo ? '플레이' : 'Play'}
        </Link>
        <Link
          href={`/${locale}/`}
          className="flex-1 py-3 rounded-xl bg-stone-900/60 border border-stone-700/40 text-stone-300 text-sm font-bold hover:bg-stone-900 transition-colors text-center"
        >
          {isKo ? '홈' : 'Home'}
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="mt-12 text-stone-700 text-[10px] text-center">
        <nav
          className="flex flex-wrap items-center justify-center gap-2 text-stone-600"
          aria-label={isKo ? '법적 고지' : 'Legal'}
        >
          <Link href={`/${locale}/guides/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '공략' : 'Guides'}
          </Link>
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
