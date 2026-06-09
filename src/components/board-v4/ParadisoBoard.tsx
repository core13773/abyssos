'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import { SPHERES } from '@/lib/data/paradiso';
import { getLightSpirit } from '@/lib/data/paradiso';

const ELEMENT_EMOJI: Record<string, string> = {
  lunar: '🌙', mercurial: '☿', venusian: '♀', solar: '☀',
  martial: '♂', jovian: '♃', saturnine: '♄', stellar: '⭐', prime: '💫',
};

export default function ParadisoBoardComponent() {
  const board = useGameStore((s) => s.paradisoBoard);
  const player = useGameStore((s) => s.player);
  const locale = useLocale((s) => s.locale);

  const currentSphereId = player?.currentSphereId ?? 1;
  const sphere = SPHERES.find((s) => s.id === currentSphereId);
  const tiles = board.filter((t) => t.sphereId === currentSphereId);

  const currentTile = tiles.find((t) => t.id === player.currentTileId);
  const currentIdx = currentTile?.index ?? 0;

  if (!player || board.length === 0 || !sphere) return null;

  const tileWidth = 90; const gap = 8; const visibleTiles = 3.5;
  const offset = -(currentIdx * (tileWidth + gap)) + (visibleTiles / 2) * (tileWidth + gap);

  return (
    <div className="w-full overflow-hidden">
      <div className="text-center mb-2">
        <p className="text-[10px] text-amber-400/60 font-serif uppercase tracking-wider">
          {locale === 'en' ? 'Celestial Realm' : '천상의 영역'}
        </p>
        <p className="text-sm font-bold text-amber-300 font-serif">
          {t('paradiso.spherePrefix', locale, { n: currentSphereId })} — {locale === 'en' ? sphere.nameEn : sphere.name}
        </p>
        <p className="text-[10px] text-stone-400 italic">
          {locale === 'en' ? sphere.virtueEn : sphere.virtue}
        </p>
      </div>

      <div className="relative h-[140px] flex items-center">
        <motion.div className="flex gap-2 absolute left-1/2" animate={{ x: offset }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
          {tiles.map((tile) => {
            const isCurrent = tile.id === player.currentTileId;
            const isPast = tile.index < currentIdx;
            let bg = 'bg-stone-800/40'; let border = 'border-stone-700'; let icon = '⬤'; let label = '';

            if (tile.type === 'spirit' && tile.spiritId) {
              const spirit = getLightSpirit(tile.spiritId);
              icon = spirit ? ELEMENT_EMOJI[spirit.element] || '✨' : '✨';
              label = spirit ? (locale === 'en' ? spirit.nameEn : spirit.name) : 'Spirit';
              bg = spirit?.tier === 'A' ? 'bg-sky-900/30' : 'bg-amber-900/30';
              border = spirit?.tier === 'A' ? 'border-sky-700/50' : 'border-amber-700/50';
            } else if (tile.type === 'blessing') {
              icon = '🌟'; label = locale === 'en' ? 'Blessing' : '축복';
              bg = 'bg-yellow-900/20'; border = 'border-yellow-700/40';
            } else if (tile.type === 'archangel') {
              icon = '👼'; label = locale === 'en' ? 'Archangel' : '대천사';
              bg = 'bg-amber-900/40'; border = 'border-amber-500/60';
            }

            return (
              <div key={tile.id} className={`relative flex-shrink-0 w-[80px] h-[110px] rounded-lg border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${bg} ${border} ${isCurrent ? 'ring-2 ring-amber-300 scale-110 z-10 shadow-lg shadow-amber-400/20' : ''} ${isPast ? 'opacity-40 saturate-0' : 'opacity-90'}`}>
                <span className="text-xl">{icon}</span>
                <span className={`text-[10px] font-bold text-center leading-tight ${isCurrent ? 'text-amber-200' : 'text-stone-200'}`}>{label}</span>
                {isCurrent && <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-300 rounded-full shadow-lg shadow-amber-400/50" />}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-2 px-4">
        <div className="flex justify-between text-[10px] text-stone-500 mb-1">
          <span>{t('paradiso.spherePrefix', locale, { n: currentSphereId })}</span>
          <span>{currentIdx + 1}/{tiles.length}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / tiles.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
