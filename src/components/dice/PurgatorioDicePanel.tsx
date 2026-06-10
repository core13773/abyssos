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
  const infernoIsDouble = useGameStore((s) => s.isDouble);
  const purgatorioDiceData = useGameStore((s) => s.purgatorioDice);
  const purgatorioIsDoubleData = useGameStore((s) => s.purgatorioIsDouble);
  const paradisoDiceData = useGameStore((s) => s.paradisoDice);
  const paradisoIsDoubleData = useGameStore((s) => s.paradisoIsDouble);
  const player = useGameStore((s) => s.player);
  const rollDiceAction = useGameStore((s) => s.rollDiceAction);
  const movePlayerAction = useGameStore((s) => s.movePlayerAction);
  const resolveEventAction = useGameStore((s) => s.resolveEventAction);
  const rollPurgatorioDice = useGameStore((s) => s.rollPurgatorioDice);
  const movePurgatorioPlayer = useGameStore((s) => s.movePurgatorioPlayer);
  const resolvePurgatorioEvent = useGameStore((s) => s.resolvePurgatorioEvent);
  const rollParadisoDice = useGameStore((s) => s.rollParadisoDice);
  const moveParadisoPlayer = useGameStore((s) => s.moveParadisoPlayer);
  const resolveParadisoBlessing = useGameStore((s) => s.resolveParadisoBlessing);
  const [isRolling, setIsRolling] = useState(false);

  if (!player) return null;

  const isPurgatorio = player.era === 'purgatorio';
  const isParadiso = player.era === 'paradiso';

  const demonDice = useGameStore((s) => s.demonDice);
  const dice = isParadiso ? paradisoDiceData : isPurgatorio ? purgatorioDiceData : infernoDice;
  const isDouble = isParadiso ? paradisoIsDoubleData : isPurgatorio ? purgatorioIsDoubleData : infernoIsDouble;
  const sum = dice ? dice[0] + dice[1] : 0;
  const demonSum = demonDice ? demonDice[0] + demonDice[1] : 0;

  const isRollPhase = isParadiso ? phase === 'paradiso_rolling' : isPurgatorio ? phase === 'purgatorio_rolling' : phase === 'rolling';
  const isMovePhase = isParadiso ? phase === 'paradiso_moving' : isPurgatorio ? phase === 'purgatorio_moving' : phase === 'moving';
  const isEventPhase = isParadiso ? phase === 'paradiso_blessing' : isPurgatorio ? phase === 'purgatorio_event' : phase === 'event';

  const summonColor = isParadiso ? 'bg-amber-700 hover:bg-amber-600' : isPurgatorio ? 'bg-purple-700 hover:bg-purple-600' : '';
  const sumColor = isParadiso ? 'text-amber-400' : isPurgatorio ? 'text-purple-400' : 'text-amber-400';
  const doubleColor = isParadiso ? 'text-amber-300' : isPurgatorio ? 'text-purple-300' : 'text-yellow-400';

  const handleRoll = () => {
    if (!isRollPhase) return;
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
      <div className="flex gap-3 items-center">
        {dice ? (
          <>
            {/* Player dice */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-stone-600 font-bold uppercase tracking-wider">{locale === 'en' ? 'YOU' : '당신'}</span>
              <div className="flex gap-1.5">
                <DiceFace value={dice[0]} size={42} />
                <DiceFace value={dice[1]} size={42} />
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">{sum}</span>
            </div>
            {/* VS + Demon dice (only if demonDice available) */}
            {demonDice && demonDice.length >= 2 ? (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-red-600 animate-pulse">VS</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] text-stone-600 font-bold uppercase tracking-wider">{locale === 'en' ? 'DEMON' : '악마'}</span>
                  <div className="flex gap-1.5">
                    <DiceFace value={demonDice[0]} size={42} fillColor="#991b1b" dotColor="#fca5a5" />
                    <DiceFace value={demonDice[1]} size={42} fillColor="#991b1b" dotColor="#fca5a5" />
                  </div>
                  <span className="text-[10px] text-red-400 font-mono font-bold">{demonSum}</span>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <>
            <DiceFace value={1} size={50} rolling={isRolling} />
            <DiceFace value={isParadiso ? 4 : 6} size={50} rolling={isRolling} />
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isRollPhase && (
          <motion.div key="roll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <Button onClick={handleRoll} variant="primary" size="lg" className={`w-full min-h-[44px] ${summonColor}`}>
              🎲 {t('dice.roll', locale)}
            </Button>
          </motion.div>
        )}

        {isMovePhase && dice && (
          <motion.div key="move" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full text-center">
            <p className={`text-lg font-bold font-serif ${sumColor}`}>
              [{dice[0]}] + [{dice[1]}] = {sum}
            </p>
            {isDouble && <p className={`text-xs mt-1 ${doubleColor}`}>{t('dice.double', locale)}</p>}
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
