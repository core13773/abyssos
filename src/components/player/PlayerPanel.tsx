'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import { CIRCLES } from '@/lib/data/circles';

export default function PlayerPanel() {
  const player = useGameStore((s) => s.player);
  const turnNumber = useGameStore((s) => s.turnNumber);
  const locale = useLocale((s) => s.locale);

  if (!player) return null;

  const circle = CIRCLES.find((c) => c.id === player.currentCircleId);
  const circleName = locale === 'en' ? (circle?.nameEn || '?') : (circle?.name || '?');
  const hpPct = (player.hp / player.maxHp) * 100;
  const hpColor = hpPct > 50 ? 'bg-emerald-500' : hpPct > 25 ? 'bg-amber-500' : 'bg-red-500';
  const isCritical = hpPct <= 25;
  const combo = player.battleStreak || 0;
  const comboLabel = combo >= 7 ? '👑 GODLIKE' : combo >= 5 ? '⚡ UNSTOPPABLE' : combo >= 3 ? '🔥 ON FIRE' : '';

  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg bg-stone-900/80 border ${isCritical ? 'border-red-600 animate-pulse' : 'border-stone-800'}`}>
      <div className="shrink-0 text-center min-w-[55px]">
        <p className="text-[9px] text-stone-500">{t('player.current', locale)}</p>
        <p className="text-[11px] font-bold text-amber-400/80 truncate">{circleName}</p>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[9px] text-stone-400 mb-0.5">
          <span>❤️ {player.hp}/{player.maxHp}</span>
          {isCritical && <span className="text-red-400 animate-pulse font-bold">💀 DANGER!</span>}
        </div>
        <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div className={`h-full ${hpColor} rounded-full transition-all duration-300 ${isCritical ? 'animate-pulse' : ''}`}
               style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      <div className="shrink-0 text-center min-w-[35px]">
        <p className="text-[9px] text-stone-500">{t('player.turn', locale)}</p>
        <p className="text-xs font-bold text-stone-300">{turnNumber}</p>
      </div>

      {combo >= 3 && (
        <div className="shrink-0 text-center min-w-[55px] bg-amber-950/50 rounded-lg px-1.5 py-1 animate-pulse">
          <p className="text-[8px] text-amber-400 font-bold">{comboLabel}</p>
          <p className="text-[11px] font-bold text-amber-300">x{combo}</p>
        </div>
      )}

      <div className="shrink-0 text-center min-w-[35px]">
        <p className="text-[9px] text-stone-500">✨</p>
        <p className="text-xs font-bold text-amber-400">{player.guardianCards.length}/9</p>
      </div>
    </div>
  );
}
