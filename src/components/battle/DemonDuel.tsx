'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';
import DiceBet from './DiceBet';

export default function DemonDuel() {
  const phase = useGameStore((s) => s.phase);
  const player = useGameStore((s) => s.player);
  const totalTurns = useGameStore((s) => s.totalTurns);
  const turnNumber = useGameStore((s) => s.turnNumber);
  const locale = useLocale((s) => s.locale);
  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  if (phase !== 'demon_duel') return null;

  const circleId = player?.currentCircleId ?? 9;
  // Deeper = harder
  const requiredWins = circleId >= 7 ? 3 : circleId >= 4 ? 2 : 1;
  const totalRounds = circleId >= 7 ? 4 : circleId >= 4 ? 3 : 2;

  const handleResult = (success: boolean) => {
    setResult(success);
    setResolved(true);
  };

  const handleContinue = () => {
    const state = useGameStore.getState();
    const p = { ...state.player, buffs: [...state.player.buffs] };
    const log = [...state.log];

    if (result) {
      // Player wins — move with current dice
      log.push({ turn: state.turnNumber, message: locale === 'en' ? '⚔ You defeated the demon! Move forward!' : '⚔ 악마를 물리쳤다! 전진하라!', type: 'critical' });
      useGameStore.setState({
        player: p, phase: 'moving',
        log,
      });
    } else {
      // Demon wins — damage
      const dmg = circleId >= 7 ? 5 : 3;
      p.hp = Math.max(0, p.hp - dmg);
      log.push({ turn: state.turnNumber, message: locale === 'en' ? `💀 Demon wins! -${dmg} HP` : `💀 악마 승리! -${dmg} HP`, type: 'damage' });
      useGameStore.setState({
        player: p, phase: 'rolling',
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        dice: null, demonDice: null, isDouble: false, doubleCount: 0,
        shakeScreen: true, showSparkles: false,
        log,
      });
      setTimeout(() => useGameStore.setState({ shakeScreen: false }), 600);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-red-700/40 rounded-2xl p-4 w-full max-w-xs" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <div className="text-center mb-3">
            <p className="text-4xl mb-2">👹</p>
            <h2 className="text-lg font-bold text-red-400 font-serif">
              {locale === 'en' ? 'Demon\'s Challenge!' : '악마의 도전!'}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {locale === 'en'
                ? `Win ${requiredWins}/${totalRounds} bets to move!`
                : `${totalRounds}판 중 ${requiredWins}승 시 이동!`}
            </p>
          </div>

          {!resolved ? (
            <DiceBet
              requiredWins={requiredWins}
              totalRounds={totalRounds}
              onResult={handleResult}
            />
          ) : (
            <div className="text-center">
              <p className={`text-xl font-bold mb-2 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? '✅' : '💀'} {result ? (locale === 'en' ? 'You Win!' : '승리!') : (locale === 'en' ? 'Demon Wins!' : '악마 승리!')}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px] bg-red-800 hover:bg-red-700">
                {locale === 'en' ? 'Continue ▶' : '계속 ▶'}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
