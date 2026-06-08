'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import GameLayout from '@/components/layout/GameLayout';
import Button from '@/components/ui/Button';

export default function GamePage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const toggleLocale = useLocale((s) => s.toggleLocale);
  const initGame = useGameStore((s) => s.initGame);
  const board = useGameStore((s) => s.board);
  const escaped = useGameStore((s) => s.escaped);
  const player = useGameStore((s) => s.player);
  const totalTurns = useGameStore((s) => s.totalTurns);

  useEffect(() => {
    if (board.length === 0) initGame();
  }, []);

  if (board.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center">
          <p className="text-2xl animate-pulse text-amber-500">🔥</p>
          <p className="text-stone-400 mt-2">{t('top.loading', locale)}</p>
        </div>
      </div>
    );
  }

  if (escaped) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 p-6">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🌟</p>
          <h1 className="text-3xl font-bold text-amber-400 font-serif mb-4">
            {t('player.escapedTitle', locale)}
          </h1>
          <p className="text-stone-400 mb-2">{t('player.escapedDesc', locale)}</p>
          <p className="text-stone-500 text-sm mb-6">
            {t('player.escapedStats', locale, { turns: totalTurns, hp: player.hp, maxHp: player.maxHp, g: player.guardianCards.length })}
          </p>
          <Button variant="primary" size="lg" onClick={initGame} className="w-full">
            {t('player.challengeAgain', locale)}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="w-full mt-2">
            {t('top.lobby', locale)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="flex items-center justify-between px-2 py-2 border-b border-stone-800 bg-stone-950/90 sticky top-0 z-40 backdrop-blur gap-1">
        <button onClick={() => router.push('/')} className="text-stone-500 hover:text-stone-300 text-xs transition-colors shrink-0">
          {t('top.lobby', locale)}
        </button>
        <h1 className="text-xs font-bold font-serif text-amber-400/80 truncate text-center">{t('top.title', locale)}</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="text-[10px]">
            {t('lang.label', locale)}
          </Button>
          <Button variant="ghost" size="sm" onClick={initGame}>
            {t('top.newGame', locale)}
          </Button>
        </div>
      </div>
      <GameLayout />
    </div>
  );
}
