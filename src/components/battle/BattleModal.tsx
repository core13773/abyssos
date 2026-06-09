'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import ColorSequence from './ColorSequence';
import { assetPath } from '@/lib/utils/assetPath';

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

  const handleResult = useCallback((success: boolean) => {
    setResult(success);
    setResolved(true);
    setBattleRoll(success ? 6 : 2);
  }, [setBattleRoll]);

  const handleQuickRoll = useCallback(() => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const success = roll >= 5;
    setResult(success);
    setResolved(true);
    setBattleRoll(roll);
  }, [setBattleRoll]);

  if (phase !== 'battle' || !monster) return null;

  const monName = locale === 'en' ? monster.nameEn : monster.name;
  const ability = locale === 'en' ? monster.abilityEn : monster.ability;
  const canSkip = player.guardianCards.some((g) => g.id === 'guardian-8');
  const tierLabel = monster.tier === 'A' ? (locale==='en'?'MINOR':'하급') : (locale==='en'?'GREATER':'상급');
  const seqLen = monster.tier === 'A' ? 3 : 4;
  const seqSpeed = monster.tier === 'A' ? 800 : 600;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-stone-700 rounded-2xl p-3 w-full max-w-xs" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-stone-600 shadow-lg">
              <object data={assetPath(`/images/${locale}/monsters/${monster.id}.svg`)} type="image/svg+xml" className="w-full h-full">
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

          {!resolved ? (
            <div className="mb-2">
              <ColorSequence sequenceLength={seqLen} showTime={seqSpeed} label={locale === 'en' ? 'Memorize & repeat the colors!' : '색깔 순서를 기억해 따라하세요!'} onResult={handleResult} />
              <div className="mt-2">
                <Button variant="ghost" size="sm" onClick={handleQuickRoll} className="w-full text-[11px]">
                  {locale === 'en' ? '🎲 Random Roll (D6 1~6)' : '🎲 랜덤 주사위 (D6 1~6)'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-2 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? '🌟 SUCCESS!' : '💀 Defeat...'}
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
