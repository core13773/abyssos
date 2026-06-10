'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import DiceFace from './DiceFace';
import Button from '@/components/ui/Button';

export default function PurgatorioDicePanel() {
  const locale = useLocale((s) => s.locale);
  const phase = useGameStore((s) => s.phase);
  const infernoDice = useGameStore((s) => s.dice);
  const purgatorioDiceData = useGameStore((s) => s.purgatorioDice);
  const paradisoDiceData = useGameStore((s) => s.paradisoDice);
  const player = useGameStore((s) => s.player);
  const demonDice = useGameStore((s) => s.demonDice);
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

  const dice = isParadiso ? paradisoDiceData : isPurgatorio ? purgatorioDiceData : infernoDice;

  const isRollPhase = isParadiso ? phase === 'paradiso_rolling'
    : isPurgatorio ? phase === 'purgatorio_rolling'
    : phase === 'rolling';
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
    }, 500);
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
      {/* Dice display */}
      <div className="flex gap-3 items-center">
        {dice ? (
          <>
            <DiceFace value={dice[0]} size={50} />
            <DiceFace value={dice[1]} size={50} />
            {demonDice && demonDice.length >= 2 && (
              <>
                <span className="text-lg font-bold text-red-600">VS</span>
                <DiceFace value={demonDice[0]} size={50} />
                <DiceFace value={demonDice[1]} size={50} />
              </>
            )}
          </>
        ) : (
          <>
            <DiceFace value={1} size={50} rolling={isRolling} />
            <DiceFace value={isParadiso ? 4 : 6} size={50} rolling={isRolling} />
          </>
        )}
      </div>

      {/* Action buttons */}
      <AnimatePresence mode="wait">
        {isRollPhase && (
          <motion.div key="roll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleRoll} variant="primary" size="lg" className={`w-full min-h-[44px] ${summonColor}`} disabled={isRolling}>
              🎲 {t('dice.roll', locale)}
            </Button>
          </motion.div>
        )}
        {isMovePhase && dice && (
          <motion.div key="move" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleMove} variant="primary" className={`w-full mt-2 min-h-[44px] ${summonColor}`}>
              {t('dice.move', locale)}
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
