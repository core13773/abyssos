'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';
import WhackMole from './WhackMole';

export default function DemonDuel() {
  const phase = useGameStore((s) => s.phase);
  const player = useGameStore((s) => s.player);
  const locale = useLocale((s) => s.locale);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [resolved, setResolved] = useState(false);

  if (phase !== 'demon_duel') return null;

  const circleId = player?.currentCircleId ?? 9;
  const targetCount = circleId >= 7 ? 5 : circleId >= 4 ? 4 : 3;
  const totalTime = circleId >= 7 ? 8 : circleId >= 4 ? 10 : 12;

  const handleResult = (success: boolean, whackedCount: number) => {
    setResult(success);
    setScore(whackedCount);
    setResolved(true);
  };

  const handleContinue = () => {
    const s = useGameStore.getState();
    const p = { ...s.player, buffs: [...s.player.buffs] };
    const log = [...s.log];

    if (result) {
      // Move by the actual number of demons whacked
      const moveAmt = Math.max(1, score);
      log.push({ turn: s.turnNumber, message: locale === 'en' ? `👹 Whacked ${score} demons! Move ${moveAmt} spaces!` : `👹 악마 ${score}마리 처치! ${moveAmt}칸 전진!`, type: 'critical' });
      useGameStore.setState({
        player: p,
        dice: [moveAmt, 0],
        demonDice: null, isDouble: false, doubleCount: 0,
        phase: 'moving',
        log,
      });
    } else {
      const dmg = circleId >= 7 ? 5 : 3;
      p.hp = Math.max(0, p.hp - dmg);
      log.push({ turn: s.turnNumber, message: locale === 'en' ? `💀 Only ${score}/${targetCount} demons! -${dmg} HP` : `💀 악마 ${score}/${targetCount}마리! -${dmg} HP`, type: 'damage' });
      useGameStore.setState({
        player: p, phase: 'rolling',
        totalTurns: s.totalTurns + 1, turnNumber: s.turnNumber + 1,
        dice: null, demonDice: null, isDouble: false, doubleCount: 0,
        shakeScreen: true,
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
              {locale === 'en' ? "Demon's Challenge!" : '악마의 도전!'}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {locale === 'en'
                ? `Whack ${targetCount}+ demons! More = move further!`
                : `악마 ${targetCount}마리 이상 잡아라! 많이 잡을수록 멀리 간다!`}
            </p>
          </div>

          {!resolved ? (
            <WhackMole
              targetCount={targetCount}
              appearTime={650}
              spawnInterval={750}
              totalTime={totalTime}
              onResult={handleResult}
            />
          ) : (
            <div className="text-center">
              <p className={`text-xl font-bold mb-2 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? '✅' : '💀'} {result ? `${locale === 'en' ? 'Whacked' : '처치'} ${score}!` : `${score}/${targetCount}`}
              </p>
              {result && <p className="text-sm text-amber-400 mb-2">→ {Math.max(1, score)} {locale === 'en' ? 'spaces' : '칸 이동'}</p>}
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
