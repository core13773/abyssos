'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import DiceFace from './DiceFace';
import Button from '@/components/ui/Button';

export default function DicePanel() {
  const locale = useLocale((s) => s.locale);
  const phase = useGameStore((s) => s.phase);
  const dice = useGameStore((s) => s.dice);
  const isDouble = useGameStore((s) => s.isDouble);
  const player = useGameStore((s) => s.player);
  const rollDiceAction = useGameStore((s) => s.rollDiceAction);
  const movePlayerAction = useGameStore((s) => s.movePlayerAction);
  const resolveEventAction = useGameStore((s) => s.resolveEventAction);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (phase !== 'rolling') return;
    setIsRolling(true);
    setTimeout(() => { rollDiceAction(); setIsRolling(false); }, 500);
  };

  if (!player) return null;

  const sum = dice ? dice[0] + dice[1] : 0;

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-stone-900/80 border border-stone-800">
      <div className="flex gap-3 items-center">
        {dice ? (
          <>
            <DiceFace value={dice[0]} size={50} />
            <DiceFace value={dice[1]} size={50} />
          </>
        ) : (
          <>
            <DiceFace value={1} size={50} rolling={isRolling} />
            <DiceFace value={6} size={50} rolling={isRolling} />
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'rolling' && (
          <motion.div key="roll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleRoll} variant="primary" size="lg" className="w-full min-h-[44px]">
              🎲 {t('dice.roll', locale)}
            </Button>
          </motion.div>
        )}

        {phase === 'moving' && dice && (
          <motion.div key="move" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <p className="text-amber-400 text-lg font-bold font-serif">
              [{dice[0]}] + [{dice[1]}] = {sum}
            </p>
            {isDouble && <p className="text-yellow-400 text-xs mt-1">{t('dice.double', locale)}</p>}
            <Button onClick={movePlayerAction} variant="primary" className="w-full mt-2 min-h-[44px]">
              {t('dice.move', locale)}
            </Button>
          </motion.div>
        )}

        {phase === 'event' && (
          <motion.div key="event" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={resolveEventAction} variant="primary" className="w-full min-h-[44px]">
              {t('dice.resolveEvent', locale)}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
