'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

export default function CelestialRewardModal() {
  const phase = useGameStore((s) => s.phase);
  const relic = useGameStore((s) => s.activeCelestialReward);
  const nextParadisoTurn = useGameStore((s) => s.nextParadisoTurn);
  const locale = useLocale((s) => s.locale);

  if (phase !== 'paradiso_relic' || !relic) return null;

  const name = locale === 'en' ? relic.nameEn : relic.name;
  const effect = locale === 'en' ? relic.effectEn : relic.effect;
  const narrative = locale === 'en' ? relic.narrativeEn : relic.narrative;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-3 w-full max-w-xs" initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <p className="text-center text-amber-300 text-sm font-bold mb-2">{t('paradiso.relicAcquired', locale)}</p>
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] h-[100px] rounded-full bg-gradient-to-br from-amber-300/30 to-yellow-500/20 border-2 border-amber-400/50 flex items-center justify-center">
              <span className="text-5xl">💠</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-amber-200 font-serif">{name}</h2>
              <p className="text-xs text-amber-100/90 font-bold mt-1">{effect}</p>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 italic leading-tight mb-3">{narrative}</p>
          <Button variant="primary" size="lg" onClick={nextParadisoTurn} className="w-full min-h-[48px] bg-amber-600 hover:bg-amber-500">
            {t('paradiso.continue', locale)}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
