'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getArcadeGame } from '@/lib/data/arcadeGames';


// localStorage 최고기록은 구독이 필요 없으므로 no-op 구독.
// useSyncExternalStore 로 읽어 effect 내 동기 setState(hydration/린트 문제)를 피한다.
const NOOP_SUBSCRIBE = () => () => {};

function readBest(gameId: string): number {
  try {
    const v = parseInt(localStorage.getItem('stg_hs_' + gameId) || '0', 10);
    return isNaN(v) ? 0 : v;
  } catch {
    return 0;
  }
}

export default function ArcadeGameClient({
  gameId,
  locale,
}: {
  gameId: string;
  locale: string;
}) {
  const router = useRouter();
  const g = getArcadeGame(gameId);
  const isKo = locale === 'ko';
  const best = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => readBest(gameId),
    () => 0,
  );

  if (!g) return null;
  const name = isKo ? g.nameKo : g.nameEn;
  const tag = isKo ? g.taglineKo : g.taglineEn;
  const desc = isKo ? g.descKo : g.descEn;
  const how = isKo ? g.howKo : g.howEn;
  const playHref = `/arcade/${gameId}/?l=${locale}`;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-stone-950">
      <div className="w-full max-w-xl z-10">
        {/* 상단 내비 */}
        <div className="flex items-center gap-2 mb-5 pt-2">
          <button
            onClick={() => router.push(`/${locale}/arcade`)}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← {isKo ? '아케이드' : 'Arcade'}
          </button>
          <button
            onClick={() => router.push(`/${locale}/`)}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isKo ? '홈' : 'Home'}
          </button>
          <button
            onClick={() => router.push(`/${isKo ? 'en' : 'ko'}/arcade/${gameId}`)}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 transition-colors ml-auto"
          >
            {isKo ? '🇺🇸 English' : '🇰🇷 한국어'}
          </button>
        </div>

        {/* 게임 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-2xl border p-5 bg-stone-900/70"
          style={{ borderColor: `${g.accent}66` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl" aria-hidden="true">{g.icon}</span>
            <div>
              <h1 className="text-2xl font-bold font-serif" style={{ color: g.accent }}>{name}</h1>
              <p className="text-xs text-stone-400 font-serif italic">{tag}</p>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed mb-3">{desc}</p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[11px] px-2 py-1 rounded-full bg-stone-950/70 border border-stone-700/50 text-stone-300">
              🎮 {how}
            </span>
            {best > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-amber-950/50 border border-amber-700/40 text-amber-400 font-mono">
                🏆 {isKo ? '최고' : 'Best'} {best}
              </span>
            )}
          </div>

          <a
            href={playHref}
            className="block w-full py-3.5 rounded-xl text-center font-serif font-bold text-lg tracking-wide transition-transform active:scale-[.98]"
            style={{ background: `linear-gradient(90deg, ${g.accent}cc, ${g.accent})`, color: '#1c1917' }}
          >
            ▶ {isKo ? '플레이' : 'Play'}
          </a>
          <p className="text-[10px] text-stone-600 text-center mt-2">
            {isKo ? '전체화면으로 열립니다' : 'Opens in fullscreen'}
          </p>
        </motion.div>

      </div>
    </main>
  );
}
