'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import { CIRCLES } from '@/lib/data/circles';
import { getMonster } from '@/lib/data/monsters';
import BoardTileComponent from './BoardTile';

export default function LinearBoard() {
  const board = useGameStore((s) => s.board);
  const player = useGameStore((s) => s.player);
  const escaped = useGameStore((s) => s.escaped);
  const locale = useLocale((s) => s.locale);
  const shakeScreen = useGameStore((s) => s.shakeScreen);

  const currentCircleId = player?.currentCircleId ?? 9;
  const circle = CIRCLES.find((c) => c.id === currentCircleId);
  const tiles = board.filter((t) => t.circleId === currentCircleId);

  // Current tile index for centering
  const currentTile = tiles.find((t) => t.id === player.currentTileId);
  const currentIdx = currentTile?.index ?? 0;

  if (!player || board.length === 0 || !circle) return null;

  const tileWidth = 90; // px per tile
  const gap = 8;
  const visibleTiles = 3.5;
  const offset = -(currentIdx * (tileWidth + gap)) + (visibleTiles / 2) * (tileWidth + gap);

  return (
    <div className={`w-full overflow-hidden ${shakeScreen ? 'screen-shake' : ''}`}>
      {/* Circle info */}
      <div className="text-center mb-2">
        <p className="text-xs text-stone-500 font-serif">
          {t('board.circlePrefix', locale, { n: currentCircleId })} — {locale === 'en' ? circle.nameEn : circle.name}
        </p>
      </div>

      {/* Board track */}
      <div className="relative h-[140px] flex items-center">
        <motion.div
          className="flex gap-2 absolute left-1/2"
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {tiles.map((tile, i) => (
            <BoardTileComponent
              key={tile.id}
              tile={tile}
              isCurrent={tile.id === player.currentTileId}
              isPast={i < currentIdx}
            />
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 px-4">
        <div className="flex justify-between text-[10px] text-stone-500 mb-1">
          <span>{t('board.circlePrefix', locale, { n: currentCircleId })}</span>
          <span>{currentIdx + 1}/{tiles.length}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / tiles.length) * 100}%` }}
          />
        </div>
      </div>

      {escaped && (
        <p className="text-center text-amber-400 font-bold mt-4 text-sm animate-pulse">
          ✦✦ {t('player.escapedTitle', locale)} ✦✦
        </p>
      )}
    </div>
  );
}
