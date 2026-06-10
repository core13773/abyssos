'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import ColorSequence from './ColorSequence';
import CardMatch from './CardMatch';
import RapidTap from './RapidTap';
import PatternMemory from './PatternMemory';
import MathPuzzle from './MathPuzzle';
import ReflexCatch from './ReflexCatch';
import RhythmTap from './RhythmTap';
import NumberMemory from './NumberMemory';
import SpeedTyping from './SpeedTyping';
import { assetPath } from '@/lib/utils/assetPath';
import type { ElementType } from '@/types/game';

export default function BattleModal() {
  const phase = useGameStore((s) => s.phase);
  const monster = useGameStore((s) => s.activeMonster);
  const player = useGameStore((s) => s.player);
  const setBattleRoll = useGameStore((s) => s.setBattleRoll);
  const resolveBattleAction = useGameStore((s) => s.resolveBattleAction);
  const skipBattleAction = useGameStore((s) => s.skipBattleAction);
  const locale = useLocale((s) => s.locale);
  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  if (phase !== 'battle' || !monster) return null;

  const monPower = monster.power;

  const handleResult = useCallback((success: boolean, d6val?: number) => {
    setResult(success);
    setResolved(true);
    // Ensure mini-game success always translates to battle victory:
    // set roll high enough to beat monster power (dice bonus will further help)
    const roll = d6val ?? (success ? Math.max(6, monPower) : Math.max(1, monPower - 3));
    setBattleRoll(roll);
  }, [setBattleRoll, monPower]);

  const handleQuickRoll = useCallback(() => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const success = roll >= monPower - 1; // more generous threshold
    setResult(success);
    setResolved(true);
    setBattleRoll(success ? Math.max(roll, monPower) : roll);
  }, [setBattleRoll, monPower]);

  const monName = locale === 'en' ? monster.nameEn : monster.name;
  const ability = locale === 'en' ? monster.abilityEn : monster.ability;
  const canSkip = player.guardianCards.some((g) => g.id === 'guardian-8');
  const tierLabel = monster.tier === 'A' ? (locale === 'en' ? 'MINOR' : '하급') : (locale === 'en' ? 'GREATER' : '상급');
  const element: ElementType = monster.element;
  const isTierB = monster.tier === 'B';

  // ── Render the appropriate mini-game based on monster element ──
  const renderBattle = () => {
    switch (element) {
      // ── ❄️ Ice: NumberMemory (frozen number recall) ──
      case 'ice':
        return (
          <NumberMemory
            digits={isTierB ? 5 : 3}
            memorizeTime={isTierB ? 1800 : 2500}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── 🎭 Illusion: CardMatch ──
      case 'illusion':
        return (
          <CardMatch
            cardCount={isTierB ? 4 : 3}
            shuffleSpeed={0.3}
            showHint={false}
            removeTrap={false}
            onResult={(correct: boolean) => handleResult(correct, correct ? 6 : 2)}
          />
        );

      // ── 🩸 Blood: RapidTap ──
      case 'blood':
        return (
          <RapidTap
            targetTaps={isTierB ? 18 : 12}
            timeLimit={isTierB ? 4.5 : 5}
            onResult={(success) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── 🔥 Fire: MathPuzzle (mental arithmetic) ──
      case 'fire':
        return (
          <MathPuzzle
            difficulty={isTierB ? 'hard' : 'medium'}
            onResult={(success) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── 💢 Mud/Wrath: SpeedTyping (mud-slick typing rush) ──
      case 'mud':
        return (
          <SpeedTyping
            wordLength={isTierB ? 'long' : 'medium'}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── 💰 Gold/Greed: Choice (gamble) ──
      case 'gold':
        return resolved ? null : (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-amber-400 text-center font-bold mb-1">
              {locale === 'en' ? '💰 The miser tests your greed...' : '💰 구두쇠가 탐욕을 시험한다...'}
            </p>
            <button
              onClick={() => {
                const success = Math.random() < 0.7;
                handleResult(success, success ? 5 : 2);
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-emerald-600/50"
            >
              🛡 {locale === 'en' ? 'Safe Path (70% win)' : '안전한 길 (70% 승리)'}
            </button>
            <button
              onClick={() => {
                const success = Math.random() < 0.3;
                handleResult(success, success ? 6 : 1);
              }}
              className="w-full py-3 bg-red-800 hover:bg-red-700 text-red-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-red-600/50"
            >
              ⚡ {locale === 'en' ? 'Gamble (30% win, 3x reward!)' : '도박 (30% 승리, 3배 보상!)'}
            </button>
          </div>
        );

      // ── 🤢 Poison: ReflexCatch (catch the falling soul) ──
      case 'poison':
        return (
          <ReflexCatch
            speed={isTierB ? 2.2 : 3.0}
            targetZone={isTierB ? 12 : 16}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── 🌪 Wind: RhythmTap (tap to the hurricane beat) ──
      case 'wind':
        return (
          <RhythmTap
            beatCount={isTierB ? 5 : 3}
            bpm={isTierB ? 140 : 100}
            tolerance={isTierB ? 180 : 250}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );

      // ── ✨ Holy: PatternMemory ──
      case 'holy':
        return (
          <PatternMemory
            patternLength={isTierB ? 4 : 3}
            memorizeTime={isTierB ? 2000 : 2500}
            label={locale === 'en' ? 'Remember the divine truth!' : '신성한 진리를 기억하라!'}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );

      default:
        // Fallback: ColorSequence
        return (
          <ColorSequence
            sequenceLength={isTierB ? 4 : 3}
            showTime={isTierB ? 600 : 800}
            label={locale === 'en' ? 'Memorize & repeat the colors!' : '색깔 순서를 기억해 따라하세요!'}
            onResult={(success: boolean) => handleResult(success, success ? 6 : 2)}
          />
        );
    }
  };

  // ── Element badge ──
  const elementBadge = (() => {
    switch (element) {
      case 'ice': return '❄️';
      case 'illusion': return '🎭';
      case 'blood': return '🩸';
      case 'fire': return '🔥';
      case 'mud': return '💢';
      case 'gold': return '💰';
      case 'poison': return '☠️';
      case 'wind': return '🌪';
      case 'holy': return '✨';
      default: return '👾';
    }
  })();

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-stone-700 rounded-2xl p-3 w-full max-w-xs" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-stone-600 shadow-lg">
              <object data={assetPath(`/images/${locale}/monsters/${monster.id}.svg`)} type="image/svg+xml" className="w-full h-full">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-3xl">{elementBadge}</div>
              </object>
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${monster.tier === 'A' ? 'text-emerald-400' : 'text-red-400'}`}>
                {elementBadge} {tierLabel}
              </span>
              <h2 className="text-base font-bold text-stone-100 font-serif truncate">{monName}</h2>
              <div className="flex gap-3 text-[10px] mt-1">
                <span className="text-amber-400 font-bold">⚔{monster.power}</span>
                <span className="text-emerald-400">HP+{monster.rewardHp}</span>
                <span className="text-red-400">HP-{monster.penaltyHp}</span>
              </div>
              <p className="text-[10px] text-stone-400 italic leading-tight mt-1">{ability}</p>
            </div>
          </div>

          {!resolved ? (
            <div className="mb-2">
              {renderBattle()}
              <div className="mt-2 pt-2 border-t border-stone-800">
                <Button variant="ghost" size="sm" onClick={handleQuickRoll} className="w-full text-[11px]">
                  {locale === 'en' ? '🎲 Random Roll (D6 1~6)' : '🎲 랜덤 주사위 (D6 1~6)'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-2 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? (locale === 'en' ? '🌟 VICTORY!' : '🌟 승리!') : (locale === 'en' ? '💀 DEFEAT...' : '💀 패배...')}
              </p>
              <Button variant="primary" size="lg" onClick={resolveBattleAction} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Continue ▶' : '계속 ▶'}
              </Button>
            </div>
          )}

          {canSkip && !resolved && (
            <Button variant="ghost" size="sm" onClick={skipBattleAction} className="w-full text-[11px] mt-1">
              {t('battle.skipWithMask', locale)}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
