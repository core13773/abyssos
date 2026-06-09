'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import TimingSlider, { type SliderResult } from './TimingSlider';

export default function BattleModal() {
  const phase = useGameStore((s) => s.phase);
  const monster = useGameStore((s) => s.activeMonster);
  const player = useGameStore((s) => s.player);
  const setBattleRoll = useGameStore((s) => s.setBattleRoll);
  const resolveBattleAction = useGameStore((s) => s.resolveBattleAction);
  const skipBattleAction = useGameStore((s) => s.skipBattleAction);
  const locale = useLocale((s) => s.locale);
  const [sliderResult, setSliderResult] = useState<SliderResult | null>(null);
  const [battleResolved, setBattleResolved] = useState(false);

  const handleSliderResult = useCallback((result: SliderResult) => {
    setSliderResult(result);
    setBattleResolved(true);
    const battleRoll = result === 'critical' ? 6 : result === 'victory' ? 5 : 2;
    setBattleRoll(battleRoll);
  }, [setBattleRoll]);

  const handleContinue = useCallback(() => {
    resolveBattleAction();
  }, [resolveBattleAction]);

  const handleQuickRoll = useCallback(() => {
    // Quick roll = D6=5 (normal victory without timing)
    setBattleRoll(5);
    setBattleResolved(true);
    setSliderResult('victory');
  }, [setBattleRoll]);

  if (phase !== 'battle' || !monster) return null;

  const monName = locale === 'en' ? monster.nameEn : monster.name;
  const ability = locale === 'en' ? monster.abilityEn : monster.ability;
  const canSkip = player.guardianCards.some((g) => g.id === 'guardian-8');
  const tierLabel = monster.tier === 'A' ? (locale==='en'?'MINOR':'하급') : (locale==='en'?'GREATER':'상급');

  let greenWidth = Math.max(8, 40 - monster.power * 3);
  let yellowWidth = Math.max(8, 25 - monster.power * 2);
  if (player.guardianCards.some((g) => g.id === 'guardian-3')) greenWidth += 5;
  if (player.guardianCards.some((g) => g.id === 'guardian-5')) greenWidth += 3;
  if (player.guardianCards.some((g) => g.id === 'guardian-1')) {
    greenWidth = Math.floor(greenWidth * 1.5);
    yellowWidth = Math.floor(yellowWidth * 1.5);
  }
  let speed = monster.tier === 'A' ? 2.0 : 1.2;
  if (player.guardianCards.some((g) => g.id === 'guardian-6')) speed *= 1.2;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-stone-700 rounded-2xl p-3 w-full max-w-xs"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-stone-600 shadow-lg">
              <object data={`/images/${locale}/monsters/${monster.id}.svg`} type="image/svg+xml" className="w-full h-full">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-3xl">👾</div>
              </object>
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${monster.tier==='A'?'text-emerald-400':'text-red-400'}`}>{tierLabel}</span>
              <h2 className="text-base font-bold text-stone-100 font-serif truncate">{monName}</h2>
              <div className="flex gap-3 text-[10px] mt-1">
                <span className="text-amber-400 font-bold">⚔{monster.power}</span>
                <span className="text-emerald-400">HP+{monster.rewardHp}</span>
                <span className="text-red-400">HP-{monster.penaltyHp}</span>
              </div>
              <p className="text-[10px] text-stone-400 italic leading-tight mt-1">{ability}</p>
            </div>
          </div>

          {/* Timing Slider OR Result + Continue */}
          {!battleResolved ? (
            <div className="mb-2">
              <TimingSlider greenWidth={greenWidth} yellowWidth={yellowWidth} speed={speed} onResult={handleSliderResult} />
              <div className="mt-2">
                <Button variant="ghost" size="sm" onClick={handleQuickRoll} className="w-full text-[11px]">
                  {locale === 'en' ? '🎲 Quick Roll (D6=5)' : '🎲 빠른 주사위 (D6=5)'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-2 ${
                sliderResult === 'critical' ? 'text-emerald-400' :
                sliderResult === 'victory' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {sliderResult === 'critical' ? '🌟 CRITICAL!' :
                 sliderResult === 'victory' ? '⚔ Victory!' : '💀 Defeat...'}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Continue ▶' : '계속 ▶'}
              </Button>
            </div>
          )}

          {canSkip && !battleResolved && (
            <Button variant="ghost" size="sm" onClick={skipBattleAction} className="w-full text-[11px] mt-1">
              {t('battle.skipWithMask', locale)}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
