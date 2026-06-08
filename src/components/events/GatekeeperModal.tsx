'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import CardMatch from '@/components/battle/CardMatch';

export default function GatekeeperModal() {
  const phase = useGameStore((s) => s.phase);
  const gk = useGameStore((s) => s.activeGatekeeper);
  const player = useGameStore((s) => s.player);
  const resolveGatekeeperAction = useGameStore((s) => s.resolveGatekeeperAction);
  const locale = useLocale((s) => s.locale);
  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  const doResolve = useCallback((correct: boolean) => {
    setResult(correct);
    setResolved(true);
    const roll = correct ? 6 : 3;
    useGameStore.getState().setBattleRoll(roll);
  }, []);

  const handleContinue = useCallback(() => {
    resolveGatekeeperAction();
  }, [resolveGatekeeperAction]);

  if (phase !== 'gatekeeper' || !gk) return null;

  const name = locale === 'en' ? gk.nameEn : gk.name;
  const title = locale === 'en' ? gk.titleEn : gk.title;
  const mechanic = locale === 'en' ? gk.mechanicEn : gk.mechanic;
  const guardianBonus = player.guardianCards.length;
  const hasLantern = player.guardianCards.some((g) => g.id === 'guardian-6');
  const hasCollar = player.guardianCards.some((g) => g.id === 'guardian-3');

  const cardCount = gk.power <= 5 ? 3 : gk.power <= 7 ? 4 : 5;
  const shuffleSpeed = gk.power <= 5 ? 0.4 : gk.power <= 7 ? 0.3 : 0.2;

  const mechLabel = locale === 'en' ? 'MECHANIC' : '고유 기믹';
  const targetLabel = locale === 'en' ? 'D6 TARGET' : 'D6 목표';
  const promptText = locale === 'en'
    ? 'Find the key card among the shuffled cards!'
    : '섞인 카드 중에서 정답 카드를 찾으세요!';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-purple-700/50 shadow-lg">
              <object data={`/images/${locale}/gatekeepers/${gk.id}.svg`} type="image/svg+xml" className="w-full h-full">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-3xl">👹</div>
              </object>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {t('gk.appeared', locale)}
              </span>
              <h2 className="text-base font-bold text-amber-300 font-serif truncate">{name}</h2>
              <p className="text-[11px] text-stone-400 italic">{title}</p>
              <p className="text-amber-400 font-bold text-xl font-serif mt-1">
                <span className="text-[9px] text-stone-500 block">{targetLabel}</span>
                {gk.power}
              </p>
            </div>
          </div>

          <div className="bg-stone-800/70 rounded-lg p-2.5 mb-2 border border-stone-700">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-0.5">{mechLabel}</p>
            <p className="text-[11px] text-stone-300 leading-relaxed">{mechanic}</p>
            {guardianBonus > 0 && (
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">
                ✨ {t('battle.guardianBonus', locale, { n: guardianBonus })}
              </p>
            )}
          </div>

          {!resolved ? (
            <div className="mb-3">
              <p className="text-center text-xs text-stone-400 mb-2">{promptText}</p>
              <CardMatch
                cardCount={cardCount}
                shuffleSpeed={shuffleSpeed}
                showHint={hasLantern}
                removeTrap={hasCollar}
                onResult={doResolve}
              />
            </div>
          ) : (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-1 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? '✅ Correct! D6=6' : '❌ Wrong! D6=3'}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Resolve ▶' : '결과 확인 ▶'}
              </Button>
            </div>
          )}

          <div className="flex gap-2 text-[10px] justify-center mt-2">
            <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full">✅ HP+{gk.rewardHp}</span>
            <span className="text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full">❌ HP-{gk.penaltyHp}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
