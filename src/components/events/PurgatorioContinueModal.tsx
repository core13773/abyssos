'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

/**
 * Modal shown after the player escapes Hell, offering to continue to Purgatorio.
 */
export default function PurgatorioContinueModal() {
  const phase = useGameStore((s) => s.phase);
  const escaped = useGameStore((s) => s.escaped);
  const player = useGameStore((s) => s.player);
  const startPurgatorio = useGameStore((s) => s.startPurgatorio);
  const initGame = useGameStore((s) => s.initGame);
  const locale = useLocale((s) => s.locale);

  // Only show when Inferno game is over and player has escaped
  if (!escaped || phase !== 'gameOver' || player.era !== 'inferno') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-purple-500/40 rounded-2xl p-5 w-full max-w-sm text-center"
          initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p className="text-5xl mb-3">🌅</p>
          <h2 className="text-xl font-bold text-purple-300 font-serif mb-2">
            {locale === 'en' ? 'Hell Conquered!' : '지옥 정복!'}
          </h2>
          <p className="text-sm text-stone-300 mb-4 leading-relaxed">
            {t('purgatorio.continueDesc', locale, {
              hp: player.hp,
              cards: player.guardianCards.length,
            })}
          </p>

          <div className="bg-stone-800/60 rounded-lg p-3 mb-4 text-left text-[11px] space-y-1">
            <p className="text-stone-400 font-bold uppercase tracking-wider mb-2">
              🌅 {locale === 'en' ? 'PURGATORIO AWAITS' : '연옥이 기다린다'}
            </p>
            <p className="text-stone-300">
              {locale === 'en'
                ? '• 7 terraces of purification'
                : '• 7개의 정화 테라스'}
            </p>
            <p className="text-stone-300">
              {locale === 'en'
                ? '• 14 sin projections to overcome'
                : '• 14종의 죄의 투영 극복'}
            </p>
            <p className="text-stone-300">
              {locale === 'en'
                ? '• 7 angel guardians to meet'
                : '• 7인의 수호천사와의 만남'}
            </p>
            <p className="text-stone-300">
              {locale === 'en'
                ? '• Your guardian cards carry over'
                : '• 수호카드가 계승됩니다'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="primary" size="lg" onClick={startPurgatorio} className="w-full">
              🌅 {t('purgatorio.continue', locale)}
            </Button>
            <Button variant="ghost" size="sm" onClick={initGame} className="w-full">
              {locale === 'en' ? 'Restart from Hell' : '지옥부터 다시 시작'}
            </Button>
          </div>

          <p className="text-[10px] text-stone-600 mt-3 italic">
            {locale === 'en'
              ? '"To climb the mountain, one must first escape the abyss."'
              : '"산을 오르려면 먼저 심연에서 빠져나와야 한다."'}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
