'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import CardMatch from '@/components/battle/CardMatch';
import RapidTap from '@/components/battle/RapidTap';
import ColorSequence from '@/components/battle/ColorSequence';
import PatternMemory from '@/components/battle/PatternMemory';
import NumberMemory from '@/components/battle/NumberMemory';
import RhythmTap from '@/components/battle/RhythmTap';
import type { AngelBattleType } from '@/types/game';

export default function AngelModal() {
  const phase = useGameStore((s) => s.phase);
  const angel = useGameStore((s) => s.activeAngelGuardian);
  const player = useGameStore((s) => s.player);
  const setBattleRoll = useGameStore((s) => s.setBattleRoll);
  const resolvePurgatorioAngel = useGameStore((s) => s.resolvePurgatorioAngel);
  const locale = useLocale((s) => s.locale);

  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  // Compute bonuses
  const purificationCards = player?.purificationCards ?? [];
  const guardianCards = player?.guardianCards ?? [];

  const resolveWithResult = useCallback((success: boolean, d6val?: number) => {
    setResult(success);
    setResolved(true);
    setBattleRoll(d6val ?? (success ? 6 : 2));
  }, [setBattleRoll]);

  const handleContinue = useCallback(() => {
    resolvePurgatorioAngel();
  }, [resolvePurgatorioAngel]);

  // Only show for purgatorio angel phase
  if (phase !== 'purgatorio_angel' || !angel) return null;

  const name = locale === 'en' ? angel.nameEn : angel.name;
  const title = locale === 'en' ? angel.titleEn : angel.title;
  const mechanic = locale === 'en' ? angel.mechanicEn : angel.mechanic;
  const bonus = locale === 'en' ? angel.purificationBonusEn : angel.purificationBonus;
  const battleType: AngelBattleType = angel.battleType;

  const renderBattle = () => {
    switch (battleType) {
      case 'timing_quiz': {
        // Angel-1 Humility: Number memory (patience through recollection)
        const hasBonus = purificationCards.some((c) => c?.id === 'purification-1');
        return (
          <NumberMemory
            digits={hasBonus ? 3 : 5}
            memorizeTime={hasBonus ? 3000 : 2000}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
          />
        );
      }

      case 'timing_smoke': {
        // Angel-3 Gentleness: Rhythm tap through the smoke
        return (
          <RhythmTap
            beatCount={4}
            bpm={120}
            tolerance={200}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 3)}
          />
        );
      }

      case 'cardmatch':
        return (
          <CardMatch
            cardCount={6}
            shuffleSpeed={0.25}
            showHint={purificationCards.some((c) => c?.id === 'purification-6')}
            removeTrap={purificationCards.some((c) => c?.id === 'purification-2')}
            onResult={(correct: boolean) => resolveWithResult(correct, correct ? 6 : 2)}
          />
        );

      case 'rapidtap':
        return (
          <RapidTap
            targetTaps={30}
            timeLimit={8}
            onResult={(success) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      case 'choice': {
        if (resolved) return null;
        return (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => resolveWithResult(Math.random() < 0.8, 5)}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-emerald-600/50"
            >
              🛡 {locale === 'en' ? 'Safe Path (80% success)' : '확실한 길 (80% 승리)'}
            </button>
            <button
              onClick={() => resolveWithResult(Math.random() < 0.4, 6)}
              className="w-full py-3 bg-purple-800 hover:bg-purple-700 text-purple-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-purple-600/50"
            >
              ⚡ {locale === 'en' ? 'Empty Path (40% success, 4x reward!)' : '비움의 길 (40% 승리, 4배 보상!)'}
            </button>
          </div>
        );
      }

      case 'quiz':
        // Angel-6 Temperance: Memory/quiz challenge
        return (
          <PatternMemory
            patternLength={4}
            memorizeTime={2500}
            onResult={(success) => resolveWithResult(success, success ? 6 : 3)}
          />
        );

      case 'purification': {
        // Angel-7 Purity: Color sequence (purification through fire)
        return (
          <ColorSequence
            sequenceLength={5}
            showTime={500}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
          />
        );
      }

      default:
        return <p className="text-center text-stone-400 text-sm">Unknown trial type</p>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="angel-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-purple-500/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          {/* Header */}
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-purple-500/50 shadow-lg bg-gradient-to-b from-purple-900/60 to-stone-900 flex items-center justify-center">
              <span className="text-5xl">😇</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {t('purgatorio.angelAppeared', locale)}
              </span>
              <h2 className="text-base font-bold text-purple-300 font-serif truncate">{name}</h2>
              <p className="text-[11px] text-stone-400 italic">{title}</p>
              <div className="flex gap-2 mt-1">
                <p className="text-purple-300 font-bold text-xl font-serif">
                  <span className="text-[9px] text-stone-500 block">{t('purgatorio.angelPower', locale)}</span>
                  {angel.power}
                </p>
                <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full self-start mt-1">
                  {battleType === 'timing_quiz' ? '🔢 Memory' :
                   battleType === 'timing_smoke' ? '🎵 Rhythm' :
                   battleType === 'cardmatch' ? '🃏 Cards' :
                   battleType === 'rapidtap' ? '⚡ Speed' :
                   battleType === 'choice' ? '🎲 Choice' :
                   battleType === 'quiz' ? '🌈 Pattern' :
                   battleType === 'purification' ? '🌈 ColorSeq' : '???'}
                </span>
              </div>
            </div>
          </div>

          {/* Mechanic description */}
          <div className="bg-stone-800/70 rounded-lg p-2.5 mb-2 border border-stone-700">
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-0.5">
              {t('purgatorio.angelMechanic', locale)}
            </p>
            <p className="text-[11px] text-stone-300 leading-relaxed">{mechanic}</p>
          </div>

          {/* Purification Bonus */}
          <div className="bg-purple-950/40 rounded-lg p-2 mb-3 border border-purple-700/30">
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-0.5">
              {t('purgatorio.purificationBonus', locale)}
            </p>
            <p className="text-[11px] text-purple-200">{bonus}</p>
          </div>

          {/* Battle area */}
          <div className="mb-3">
            {renderBattle()}
          </div>

          {/* Continue button */}
          {resolved && result !== null && (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-1 ${result ? 'text-emerald-400' : 'text-purple-400'}`}>
                {result
                  ? (locale === 'en' ? '✅ TRIAL PASSED!' : '✅ 시험 통과!')
                  : (locale === 'en' ? '💫 NOT YET...' : '💫 아직...')}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Resolve ▶' : '결과 확인 ▶'}
              </Button>
            </div>
          )}

          {/* Reward/Penalty summary */}
          <div className="flex gap-2 text-[10px] justify-center mt-2">
            <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full">
              ✅ HP+{angel.rewardHp} + 🃏
            </span>
            <span className="text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-full">
              💫 -{Math.floor(angel.rewardHp * 0.15)} HP
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
