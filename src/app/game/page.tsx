'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import GameLayout from '@/components/layout/GameLayout';
import Button from '@/components/ui/Button';
import { createNewGameV4 } from '@/lib/game/engine';
import { createPurgatorioGame } from '@/lib/game/purgatorio-engine';
import { createParadisoGame } from '@/lib/game/paradiso-engine';
import { GUARDIANS } from '@/lib/data/guardians';
import { PURIFICATION_CARDS } from '@/lib/data/purgatorio';
import type { Player, GameState } from '@/types/game';

function createDefaultInfernoClearPlayer(): Player {
  const base = createNewGameV4().player;
  return {
    ...base, hp: 80, maxHp: 100,
    guardianCards: [GUARDIANS[0], GUARDIANS[1], GUARDIANS[2], GUARDIANS[3]],
    era: 'inferno' as const, purificationCards: [], totalCardCount: 4,
    grace: 0, celestialRelics: [],
  };
}

function createDefaultPurgatorioClearPlayer(): Player {
  const base = createDefaultInfernoClearPlayer();
  return {
    ...base, hp: 90, maxHp: 100,
    purificationCards: [PURIFICATION_CARDS[0], PURIFICATION_CARDS[1], PURIFICATION_CARDS[2]],
    era: 'purgatorio' as const, totalCardCount: 7,
  };
}

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eraParam = searchParams.get('era');
  const locale = useLocale((s) => s.locale);
  const toggleLocale = useLocale((s) => s.toggleLocale);
  const initGame = useGameStore((s) => s.initGame);
  const board = useGameStore((s) => s.board);
  const purgatorioBoard = useGameStore((s) => s.purgatorioBoard);
  const paradisoBoard = useGameStore((s) => s.paradisoBoard);
  const escaped = useGameStore((s) => s.escaped);
  const player = useGameStore((s) => s.player);
  const totalTurns = useGameStore((s) => s.totalTurns);

  const isPurgatorio = player.era === 'purgatorio';
  const isParadiso = player.era === 'paradiso';

  useEffect(() => {
    // Check all boards — only init if nothing is loaded
    if (board.length > 0 || purgatorioBoard.length > 0 || paradisoBoard.length > 0) return;

    const era = eraParam;

    // Gate check: read realm completion from localStorage
    const getRealmCompleted = (realm: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        const raw = localStorage.getItem('abyssos_realms');
        if (raw) {
          const data = JSON.parse(raw);
          return data[realm]?.completed === true;
        }
      } catch { /* ignore */ }
      return false;
    };

    if (era === 'purgatorio') {
      if (!getRealmCompleted('inferno')) {
        router.replace('/');
        return;
      }
      const infernoPlayer = createDefaultInfernoClearPlayer();
      const state = createPurgatorioGame(infernoPlayer);
      useGameStore.setState(state as Partial<GameState>);
      return;
    }

    if (era === 'paradiso') {
      if (!getRealmCompleted('purgatorio')) {
        router.replace('/');
        return;
      }
      const purgatorioPlayer = createDefaultPurgatorioClearPlayer();
      const state = createParadisoGame(purgatorioPlayer);
      useGameStore.setState(state as Partial<GameState>);
      return;
    }

    initGame();
  }, [board.length, purgatorioBoard.length, paradisoBoard.length, eraParam, initGame, router]);

  const isBoardReady = isParadiso ? paradisoBoard.length > 0 : isPurgatorio ? purgatorioBoard.length > 0 : board.length > 0;

  if (!isBoardReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center">
          <p className="text-2xl animate-pulse text-purple-400">🌅</p>
          <p className="text-stone-400 mt-2">{t('top.loading', locale)}</p>
        </div>
      </div>
    );
  }

  // Purgatorio complete screen
  if (isPurgatorio && escaped) {
    const totalCards = player.totalCardCount || (player.guardianCards.length + player.purificationCards.length);
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 p-6" aria-labelledby="paradise-title">
        <section className="text-center max-w-sm">
          <p className="text-5xl mb-4" aria-hidden="true">🌹</p>
          <h1 id="paradise-title" className="text-3xl font-bold text-purple-300 font-serif mb-4">
            {t('purgatorio.earthlyParadise', locale)}
          </h1>
          <p className="text-stone-400 mb-2">{t('purgatorio.earthlyParadiseDesc', locale)}</p>
          <p className="text-stone-500 text-sm mb-6">
            {locale === 'en'
              ? `Turns: ${totalTurns} | HP: ${player.hp}/${player.maxHp} | Cards: ${totalCards}/16`
              : `턴: ${totalTurns} | HP: ${player.hp}/${player.maxHp} | 카드: ${totalCards}/16`}
          </p>
          <Button variant="primary" size="lg" onClick={initGame} className="w-full bg-purple-700 hover:bg-purple-600">
            {locale === 'en' ? '🌅 Journey Again' : '🌅 다시 여정을 시작'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="w-full mt-2">
            {t('top.lobby', locale)}
          </Button>
        </section>
      </main>
    );
  }

  // Paradiso complete screen
  if (isParadiso && escaped) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 p-6" aria-labelledby="empyrean-title">
        <section className="text-center max-w-sm">
          <p className="text-5xl mb-4" aria-hidden="true">☀</p>
          <h1 id="empyrean-title" className="text-3xl font-bold text-amber-300 font-serif mb-4">
            {t('paradiso.empyrean', locale)}
          </h1>
          <p className="text-stone-400 mb-2">{t('paradiso.empyreanDesc', locale)}</p>
          <p className="text-stone-500 text-sm mb-6">
            {locale === 'en'
              ? `Turns: ${totalTurns} | Grace: ${player.grace} | Relics: ${player.celestialRelics.length}/9`
              : `턴: ${totalTurns} | 은총: ${player.grace} | 성물: ${player.celestialRelics.length}/9`}
          </p>
          <Button variant="primary" size="lg" onClick={initGame} className="w-full bg-amber-600 hover:bg-amber-500">
            {locale === 'en' ? '☀ Journey Again' : '☀ 다시 여정을 시작'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="w-full mt-2">
            {t('top.lobby', locale)}
          </Button>
        </section>
      </main>
    );
  }

  // Inferno escape screen (existing)
  if (escaped) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 p-6" aria-labelledby="escape-title">
        <section className="text-center max-w-sm">
          <p className="text-5xl mb-4" aria-hidden="true">🌟</p>
          <h1 id="escape-title" className="text-3xl font-bold text-amber-400 font-serif mb-4">
            {t('player.escapedTitle', locale)}
          </h1>
          <p className="text-stone-400 mb-2">{t('player.escapedDesc', locale)}</p>
          <p className="text-stone-500 text-sm mb-6" aria-live="polite">
            {t('player.escapedStats', locale, { turns: totalTurns, hp: player.hp, maxHp: player.maxHp, g: player.guardianCards.length })}
          </p>
          <Button variant="primary" size="lg" onClick={initGame} className="w-full">
            {t('player.challengeAgain', locale)}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="w-full mt-2">
            {t('top.lobby', locale)}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950" aria-label={t('top.title', locale)}>
      <nav className="flex items-center justify-between px-2 py-2 border-b border-stone-800 bg-stone-950/90 sticky top-0 z-40 backdrop-blur gap-1" aria-label={locale === 'ko' ? '게임 메뉴' : 'Game Menu'}>
        <button onClick={() => router.push('/')} className="text-stone-500 hover:text-stone-300 text-xs transition-colors shrink-0" aria-label={locale === 'ko' ? '로비로 돌아가기' : 'Back to Lobby'}>
          {t('top.lobby', locale)}
        </button>
        <h1 className="text-xs font-bold font-serif text-amber-400/80 truncate text-center">{t('top.title', locale)}</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="text-[10px]" aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}>
            {t('lang.label', locale)}
          </Button>
          <Button variant="ghost" size="sm" onClick={initGame} aria-label={locale === 'ko' ? '새 게임 시작' : 'Start New Game'}>
            {t('top.newGame', locale)}
          </Button>
        </div>
      </nav>
      <GameLayout />
    </main>
  );
}
