'use client';

import type { BoardTile } from '@/types/game';
import { getMonster } from '@/lib/data/monsters';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

const ELEMENT_EMOJI: Record<string, string> = {
  ice: '❄️', illusion: '🎭', blood: '🩸', fire: '🔥',
  mud: '💢', gold: '💰', poison: '☠️', wind: '🌪', holy: '✨',
};

interface Props { tile: BoardTile; isCurrent: boolean; isPast: boolean; }

export default function BoardTileComponent({ tile, isCurrent, isPast }: Props) {
  const locale = useLocale((s) => s.locale);
  let bg = 'bg-stone-800/50';
  let border = 'border-stone-700';
  let icon = '⬤';
  let label = '';
  let sublabel = '';

  if (tile.type === 'monster' && tile.monsterId) {
    const monster = getMonster(tile.monsterId);
    if (monster) {
      icon = ELEMENT_EMOJI[monster.element] || '👾';
      label = locale === 'en' ? monster.nameEn : monster.name;
      const tierLabel = monster.tier === 'A' ? t('tile.tier.minor', locale) : t('tile.tier.greater', locale);
      sublabel = `${tierLabel} ⚔${monster.power}`;
      bg = monster.tier === 'A' ? 'bg-emerald-900/40' : 'bg-red-900/40';
      border = monster.tier === 'A' ? 'border-emerald-700/50' : 'border-red-700/50';
    }
  } else if (tile.type === 'event' && tile.eventKind) {
    const eventLabels: Record<string, string> = {
      rest: t('tile.event.rest', locale),
      trap: t('tile.event.trap', locale),
      blessing: t('tile.event.blessing', locale),
      curse: t('tile.event.curse', locale),
      treasure: '💎',
      choice: locale === 'en' ? 'CHOICE' : '선택',
    };
    const eventIcons: Record<string, string> = { rest: '✧', trap: '⚠', blessing: '★', curse: '☠', treasure: '💎', choice: '🤔' };
    icon = eventIcons[tile.eventKind] || '🎲';
    label = eventLabels[tile.eventKind] || t('tile.event', locale);
    bg = 'bg-stone-700/40';
    border = 'border-stone-600/50';
  } else if (tile.type === 'gatekeeper') {
    icon = '👹';
    label = t('tile.gatekeeper', locale);
    sublabel = t('tile.tier.boss', locale);
    bg = 'bg-yellow-900/40';
    border = 'border-yellow-600/60';
  }

  return (
    <div className={`
      relative flex-shrink-0 w-[80px] h-[110px] rounded-lg border
      flex flex-col items-center justify-center gap-1 transition-all duration-300
      ${bg} ${border}
      ${isCurrent ? 'ring-2 ring-amber-400 scale-110 z-10 shadow-lg shadow-amber-500/20' : ''}
      ${isPast ? 'opacity-40 saturate-0' : 'opacity-90'}
    `}>
      <span className="text-xl">{icon}</span>
      <span className={`text-[10px] font-bold text-center leading-tight ${isCurrent ? 'text-amber-200' : 'text-stone-300'}`}>{label}</span>
      {sublabel && <span className="text-[9px] text-stone-400">{sublabel}</span>}
      {isCurrent && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-500/50" />
      )}
    </div>
  );
}
