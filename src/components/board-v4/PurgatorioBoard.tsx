'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import { TERRACES } from '@/lib/data/purgatorio';
import { getSinProjection } from '@/lib/data/purgatorio';

const ELEMENT_EMOJI: Record<string, string> = {
  earth: '🪨', sight: '👁', smoke: '🌫', lightning: '⚡',
  crystal: '💎', wood: '🌳', purgefire: '🔥',
};

export default function PurgatorioBoardComponent() {
  const board = useGameStore((s) => s.purgatorioBoard);
  const player = useGameStore((s) => s.player);
  const locale = useLocale((s) => s.locale);

  const currentTerraceId = player?.currentTerraceId ?? 1;
  const terrace = TERRACES.find((t) => t.id === currentTerraceId);
  const tiles = board.filter((t) => t.terraceId === currentTerraceId);

  const currentTile = tiles.find((t) => t.id === player.currentTileId);
  const currentIdx = currentTile?.index ?? 0;

  if (!player || board.length === 0 || !terrace) return null;

  const tileWidth = 90;
  const gap = 8;
  const visibleTiles = 3.5;
  const offset = -(currentIdx * (tileWidth + gap)) + (visibleTiles / 2) * (tileWidth + gap);

  return (
    <div className="w-full overflow-hidden">
      {/* Terrace info */}
      <div className="text-center mb-2">
        <p className="text-xs text-purple-400/70 font-serif uppercase tracking-wider">
          {locale === 'en' ? 'Mount Purgatory' : '연옥산'}
        </p>
        <p className="text-sm font-bold text-purple-300 font-serif">
          {t('purgatorio.terracePrefix', locale, { n: currentTerraceId })} — {locale === 'en' ? terrace.nameEn : terrace.name}
        </p>
        <p className="text-[10px] text-stone-500 italic">
          {locale === 'en' ? terrace.purificationMethodEn : terrace.purificationMethod}
        </p>
      </div>

      {/* Board track */}
      <div className="relative h-[140px] flex items-center">
        <motion.div
          className="flex gap-2 absolute left-1/2"
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {tiles.map((tile) => {
            const isCurrent = tile.id === player.currentTileId;
            const isPast = tile.index < currentIdx;
            let bg = 'bg-stone-800/50';
            let border = 'border-stone-700';
            let icon = '⬤';
            let label = '';
            let sublabel = '';

            if (tile.type === 'sin' && tile.sinProjectionId) {
              const sin = getSinProjection(tile.sinProjectionId);
              if (sin) {
                icon = ELEMENT_EMOJI[sin.element] || '👤';
                label = locale === 'en' ? sin.nameEn : sin.name;
                sublabel = `${sin.tier === 'A' ? (locale === 'en' ? 'Choice' : '선택') : (locale === 'en' ? 'Greater Trial' : '상급 시련')}`;
                bg = sin.tier === 'A' ? 'bg-violet-900/30' : 'bg-purple-900/40';
                border = sin.tier === 'A' ? 'border-violet-700/50' : 'border-purple-700/50';
              }
            } else if (tile.type === 'event') {
              const eventIcons: Record<string, string> = {
                rest: '✧', choice: '🤔', blessing: '★', curse: '☠', treasure: '🕊',
              };
              const eventLabels: Record<string, string> = {
                rest: locale === 'en' ? 'Prayer' : '기도',
                choice: locale === 'en' ? 'Choice' : '선택',
                blessing: locale === 'en' ? 'Starlight' : '별빛',
                curse: locale === 'en' ? 'Sin Weight' : '죄의 무게',
                treasure: locale === 'en' ? 'Feather' : '깃털',
              };
              icon = eventIcons[tile.eventKind || ''] || '🎲';
              label = eventLabels[tile.eventKind || ''] || 'Event';
              bg = 'bg-stone-700/40';
              border = 'border-stone-600/50';
            } else if (tile.type === 'angel') {
              icon = '😇';
              label = t('purgatorio.angel', locale);
              sublabel = locale === 'en' ? 'TRIAL' : '시험';
              bg = 'bg-purple-900/40';
              border = 'border-purple-500/60';
            }

            return (
              <div
                key={tile.id}
                className={`
                  relative flex-shrink-0 w-[80px] h-[110px] rounded-lg border
                  flex flex-col items-center justify-center gap-1 transition-all duration-300
                  ${bg} ${border}
                  ${isCurrent ? 'ring-2 ring-purple-400 scale-110 z-10 shadow-lg shadow-purple-500/20' : ''}
                  ${isPast ? 'opacity-40 saturate-0' : 'opacity-90'}
                `}
              >
                <span className="text-xl">{icon}</span>
                <span className={`text-[10px] font-bold text-center leading-tight ${isCurrent ? 'text-purple-200' : 'text-stone-300'}`}>
                  {label}
                </span>
                {sublabel && <span className="text-[9px] text-stone-400">{sublabel}</span>}
                {isCurrent && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 px-4">
        <div className="flex justify-between text-[10px] text-stone-500 mb-1">
          <span>{t('purgatorio.terracePrefix', locale, { n: currentTerraceId })}</span>
          <span>{currentIdx + 1}/{tiles.length}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / tiles.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
