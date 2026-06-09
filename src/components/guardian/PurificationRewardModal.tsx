'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

export default function PurificationRewardModal() {
  const phase = useGameStore((s) => s.phase);
  const purification = useGameStore((s) => s.activePurificationReward);
  const nextPurgatorioTurn = useGameStore((s) => s.nextPurgatorioTurn);
  const locale = useLocale((s) => s.locale);

  if (phase !== 'purgatorio_purification' || !purification) return null;

  const name = locale === 'en' ? purification.nameEn : purification.name;
  const mainEffect = locale === 'en' ? purification.mainEffectEn : purification.mainEffect;
  const narrative = locale === 'en' ? purification.narrativeEn : purification.narrative;

  const elementIcons: Record<string, string> = {
    earth: '🪨', sight: '👁', smoke: '🌫', lightning: '⚡',
    crystal: '💎', wood: '🌳', purgefire: '🔥',
  };
  const icon = elementIcons[purification.element] || '✨';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-purple-500/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p className="text-center text-purple-300 text-sm font-bold mb-2">
            {t('purgatorio.purificationAcquired', locale)}
          </p>

          {/* Card + Info */}
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[120px] aspect-[750/1050] rounded-lg overflow-hidden border border-purple-500/50 shadow-lg bg-gradient-to-b from-purple-900/40 to-stone-900 flex items-center justify-center">
              <span className="text-6xl">{icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase bg-purple-950/50 px-1.5 py-0.5 rounded-full">
                PURIFICATION
              </span>
              <h2 className="text-base font-bold text-purple-200 font-serif mt-1">{name}</h2>
              <p className="text-xs text-purple-100/90 font-bold mt-1">{mainEffect}</p>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic leading-tight mb-3">{narrative}</p>

          <Button variant="primary" size="lg" onClick={nextPurgatorioTurn} className="w-full min-h-[48px] text-base">
            {t('purgatorio.purificationContinue', locale)}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
