'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import { assetPath } from '@/lib/utils/assetPath';

export default function GuardianRewardModal() {
  const phase = useGameStore((s) => s.phase);
  const guardian = useGameStore((s) => s.activeGuardianReward);
  const nextTurn = useGameStore((s) => s.nextTurn);
  const locale = useLocale((s) => s.locale);

  if (phase !== 'guardianReward' || !guardian) return null;

  const name = locale === 'en' ? guardian.nameEn : guardian.name;
  const mainEffect = locale === 'en' ? guardian.mainEffectEn : guardian.mainEffect;
  const narrative = locale === 'en' ? guardian.narrativeEn : guardian.narrative;
  const effectLabel = guardian.effectType === 'active' ? 'ACTIVE' : guardian.effectType === 'both' ? 'BOTH' : 'PASSIVE';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p className="text-center text-amber-400 text-sm font-bold mb-2">
            {t('guardian.acquired', locale)}
          </p>

          {/* Card + Info */}
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[120px] aspect-[750/1050] rounded-lg overflow-hidden border border-amber-500/50 shadow-lg">
              <object data={assetPath(`/images/${locale}/guardians/${guardian.id}.svg`)} type="image/svg+xml" className="w-full h-full">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-4xl">✨</div>
              </object>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-amber-500 font-bold uppercase bg-amber-950/50 px-1.5 py-0.5 rounded-full">{effectLabel}</span>
              <h2 className="text-base font-bold text-amber-200 font-serif mt-1">{name}</h2>
              <p className="text-xs text-amber-100/90 font-bold mt-1">{mainEffect}</p>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 italic leading-tight mb-3">{narrative}</p>

          <Button variant="primary" size="lg" onClick={nextTurn} className="w-full min-h-[48px] text-base">
            {t('guardian.continue', locale)}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
