'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import { ARCADE_GAMES } from '@/lib/data/arcadeGames';
import AdUnit from '@/components/layout/AdUnit';

const AD_SLOT_MAIN = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN;

export default function ArcadeHubPage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const isKo = locale === 'ko';

  const open = (id: string, abyssos?: boolean) => {
    router.push(abyssos ? `/${locale}/game` : `/${locale}/arcade/${id}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-stone-950 relative">
      {/* Arcade 허브 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: isKo ? '아케이드 — 어비소스' : 'Arcade — Abyssos',
            itemListElement: ARCADE_GAMES.map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: isKo ? g.nameKo : g.nameEn,
              // abyssos 로그라이크는 /game 으로 라우팅되므로 /arcade/ URL(404)를 피한다.
              url: g.abyssos ? `/${locale}/game/` : `/${locale}/arcade/${g.id}/`,
            })),
          }),
        }}
      />

      {/* 헤더 */}
      <header className="text-center mb-6 sm:mb-8 z-10 pt-6 sm:pt-10 w-full max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 mb-1"
        >
          {isKo ? '아케이드' : 'Arcade'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm sm:text-base text-stone-400 font-serif italic"
        >
          {isKo ? '8종 게임을 한곳에서' : '8 games in one place'}
        </motion.p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => router.push(`/${locale}/`)}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← {isKo ? '홈' : 'Home'}
          </button>
          <button
            onClick={() => { const next = isKo ? 'en' : 'ko'; router.push(`/${next}/arcade`); }}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isKo ? '🇺🇸 English' : '🇰🇷 한국어'}
          </button>
        </div>
      </header>

      {/* 게임 카드 그리드 */}
      <section className="w-full max-w-2xl z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-8">
        {ARCADE_GAMES.map((g, i) => {
          const name = isKo ? g.nameKo : g.nameEn;
          const tag = isKo ? g.taglineKo : g.taglineEn;
          const desc = isKo ? g.descKo : g.descEn;
          return (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => open(g.id, g.abyssos)}
              className="text-left rounded-2xl border p-4 bg-stone-900/70 hover:bg-stone-900 transition-colors"
              style={{ borderColor: `${g.accent}66` }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-3xl" aria-hidden="true">{g.icon}</span>
                <h2 className="text-lg font-bold font-serif" style={{ color: g.accent }}>{name}</h2>
                {g.abyssos && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-900/50 text-amber-400 border border-amber-700/40">
                    ROGUELIKE
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-serif italic mb-1.5">{tag}</p>
              <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed line-clamp-3">{desc}</p>
            </motion.button>
          );
        })}
      </section>

      {/* 광고 */}
      {AD_SLOT_MAIN && (
        <section className="w-full max-w-2xl z-10 mb-6" aria-label={isKo ? '광고' : 'Advertisement'}>
          <AdUnit slot={AD_SLOT_MAIN} format="horizontal" responsive className="my-2" />
        </section>
      )}

      <footer className="text-stone-700 text-[10px] text-center pb-4 z-10">
        <p className="font-serif italic">Abyssos Arcade</p>
        <nav className="mt-2 flex items-center justify-center gap-2 text-stone-600" aria-label={isKo ? '법적 고지' : 'Legal'}>
          <a href={`/${locale}/guides/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '공략' : 'Guides'}
          </a>
          <span aria-hidden="true">·</span>
          <a href={`/${locale}/privacy/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '개인정보처리방침' : 'Privacy'}
          </a>
          <span aria-hidden="true">·</span>
          <a href={`/${locale}/terms/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '이용약관' : 'Terms'}
          </a>
          <span aria-hidden="true">·</span>
          <a href={`/${locale}/contact/`} className="underline hover:text-stone-400 transition-colors">
            {isKo ? '문의' : 'Contact'}
          </a>
        </nav>
      </footer>
    </main>
  );
}
