'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

export default function PurgatorioDicePanel() {
  const locale = useLocale((s) => s.locale);
  const phase = useGameStore((s) => s.phase);
  const player = useGameStore((s) => s.player);
  const dice = useGameStore((s) => s.dice);
  const rollDiceAction = useGameStore((s) => s.rollDiceAction);
  const resolveEventAction = useGameStore((s) => s.resolveEventAction);
  const rollPurgatorioDice = useGameStore((s) => s.rollPurgatorioDice);
  const resolvePurgatorioEvent = useGameStore((s) => s.resolvePurgatorioEvent);
  const rollParadisoDice = useGameStore((s) => s.rollParadisoDice);
  const resolveParadisoBlessing = useGameStore((s) => s.resolveParadisoBlessing);
  const movePlayerAction = useGameStore((s) => s.movePlayerAction);
  const movePurgatorioPlayer = useGameStore((s) => s.movePurgatorioPlayer);
  const moveParadisoPlayer = useGameStore((s) => s.moveParadisoPlayer);
  const [isRolling, setIsRolling] = useState(false);

  if (!player) return null;

  const isPurgatorio = player.era === 'purgatorio';
  const isParadiso = player.era === 'paradiso';

  const isRollPhase = isParadiso ? phase === 'paradiso_rolling'
    : isPurgatorio ? phase === 'purgatorio_rolling'
    : phase === 'rolling';
  const isDuelPhase = phase === 'demon_duel';
  const isMovePhase = isParadiso ? phase === 'paradiso_moving'
    : isPurgatorio ? phase === 'purgatorio_moving'
    : phase === 'moving';
  const isEventPhase = isParadiso ? phase === 'paradiso_blessing'
    : isPurgatorio ? phase === 'purgatorio_event'
    : phase === 'event';

  const summonColor = isParadiso ? 'bg-amber-700 hover:bg-amber-600'
    : isPurgatorio ? 'bg-purple-700 hover:bg-purple-600' : '';

  const handleRoll = () => {
    if (!isRollPhase || isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      if (isParadiso) rollParadisoDice();
      else if (isPurgatorio) rollPurgatorioDice();
      else rollDiceAction();
      setIsRolling(false);
    }, 400);
  };

  const handleMove = () => {
    if (isParadiso) moveParadisoPlayer();
    else if (isPurgatorio) movePurgatorioPlayer();
    else movePlayerAction();
  };

  const handleResolve = () => {
    if (isParadiso) resolveParadisoBlessing();
    else if (isPurgatorio) resolvePurgatorioEvent();
    else resolveEventAction();
  };

  const getEventLabel = () => {
    if (isParadiso) return locale === 'en' ? 'Receive Blessing' : '축복 받기';
    return t('dice.resolveEvent', locale);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-stone-900/80 border border-stone-800">
      <AnimatePresence mode="wait">
        {isRollPhase && (
          <motion.div key="roll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleRoll} variant="primary" size="lg" className={`w-full min-h-[44px] ${summonColor}`} disabled={isRolling}>
              👹 {locale === 'en' ? 'Challenge Demon' : '악마에게 도전'}
            </Button>
          </motion.div>
        )}
        {isDuelPhase && (
          <motion.div key="duel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <p className="text-lg text-red-400 animate-pulse font-bold">
              👹 {locale === 'en' ? 'Fight!' : '대결 중!'}
            </p>
          </motion.div>
        )}
        {isMovePhase && dice && (
          <motion.div key="move" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleMove} variant="primary" className={`w-full min-h-[44px] ${summonColor}`}>
              ▶ {locale === 'en' ? 'Move' : '이동'}
            </Button>
          </motion.div>
        )}
        {isEventPhase && (
          <motion.div key="event" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleResolve} variant="primary" className={`w-full min-h-[44px] ${summonColor}`}>
              {getEventLabel()}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
