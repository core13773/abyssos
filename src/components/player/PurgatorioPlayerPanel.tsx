'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

export default function PurgatorioPlayerPanel() {
  const player = useGameStore((s) => s.player);
  const turnNumber = useGameStore((s) => s.turnNumber);
  const log = useGameStore((s) => s.log);
  const locale = useLocale((s) => s.locale);
  const [showCurses, setShowCurses] = useState(false);

  const isPurgatorio = player.era === 'purgatorio';

  // Inferno PlayerPanel (simplified fallback)
  if (!isPurgatorio) {
    const infernoPlayer = player;
    const hpPct = infernoPlayer.hp / infernoPlayer.maxHp;
    const isDanger = hpPct <= 0.25;
    const recentLog = log.slice(-1)[0];

    return (
      <>
      <div className={`flex items-center justify-between p-2 rounded-lg border ${isDanger ? 'border-red-800 bg-red-950/30 hp-critical' : 'border-stone-800 bg-stone-900/60'}`}>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] text-stone-500">{t('player.hp', locale)}</p>
            <p className={`text-lg font-bold font-serif ${isDanger ? 'text-red-400 animate-pulse' : hpPct < 0.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {Math.max(0, infernoPlayer.hp)}/{infernoPlayer.maxHp}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-stone-500">{t('player.turn', locale)}</p>
            <p className="text-lg font-bold text-stone-200">{turnNumber}</p>
          </div>
        </div>
        <div className="text-right flex gap-3">
          <div>
            <p className="text-[10px] text-stone-500">{t('player.guardians', locale)}</p>
            <p className="text-lg font-bold text-amber-400">{infernoPlayer.guardianCards.length}/9</p>
          </div>
          {infernoPlayer.curseCards.length > 0 && (
            <div className="cursor-pointer" onClick={() => setShowCurses(true)}>
              <p className="text-[10px] text-red-500">💀</p>
              <p className="text-lg font-bold text-red-400">{infernoPlayer.curseCards.length}</p>
            </div>
          )}
          {infernoPlayer.consumables.length > 0 && (
            <div>
              <p className="text-[10px] text-cyan-500">🎒</p>
              <p className="text-lg font-bold text-cyan-400">{infernoPlayer.consumables.length}</p>
            </div>
          )}
          {(infernoPlayer.soulStones || 0) > 0 && (
            <div>
              <p className="text-[10px] text-purple-500">✨</p>
              <p className="text-lg font-bold text-purple-400">{infernoPlayer.soulStones}</p>
            </div>
          )}
        </div>
        {recentLog && (
          <p className="text-[9px] text-stone-500 truncate max-w-[120px] hidden sm:block">{recentLog.message}</p>
        )}
      </div>
      <AnimatePresence>
        {showCurses && infernoPlayer.curseCards.length > 0 && (
          <CurseModal cards={infernoPlayer.curseCards} locale={locale} onClose={() => setShowCurses(false)} />
        )}
      </AnimatePresence>
    </>
    );
  }

  // ---- Paradiso mode ----
  if (player.era === 'paradiso') {
    const grace = player.grace || 0;
    const maxGrace = player.celestialRelics?.some(c => c.id === 'relic-8') ? 150 : 100;
    const gracePct = grace / maxGrace;
    const recentLog = log.slice(-1)[0];

    return (
      <div className="flex items-center justify-between p-2 rounded-lg border border-amber-600/40 bg-amber-950/15">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] text-amber-400/70">{t('paradiso.grace', locale)}</p>
            <p className={`text-lg font-bold font-serif ${gracePct >= 0.9 ? 'text-amber-200 animate-pulse' : 'text-amber-400'}`}>
              {grace}/{maxGrace}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-stone-500">{t('player.turn', locale)}</p>
            <p className="text-lg font-bold text-stone-200">{turnNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-amber-400/70">{t('paradiso.relic', locale)}</p>
          <p className="text-lg font-bold text-amber-300">{player.celestialRelics?.length || 0}/9</p>
        </div>
        {recentLog && <p className="text-[9px] text-stone-500 truncate max-w-[100px] hidden sm:block">{recentLog.message}</p>}
      </div>
    );
  }

  // ---- Purgatorio mode ----
  const hpPct = player.hp / player.maxHp;
  const isDanger = hpPct <= 0.25;
  const totalCards = player.totalCardCount || (player.guardianCards.length + player.purificationCards.length);
  const recentLog = log.slice(-1)[0];

  return (
    <div className={`flex items-center justify-between p-2 rounded-lg border ${isDanger ? 'border-red-800 bg-red-950/30 hp-critical' : 'border-purple-800/50 bg-purple-950/20'}`}>
      <div className="flex items-center gap-3">
        <div>
          <p className="text-[10px] text-stone-500">{t('player.hp', locale)}</p>
          <p className={`text-lg font-bold font-serif ${isDanger ? 'text-red-400 animate-pulse' : hpPct < 0.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {Math.max(0, player.hp)}/{player.maxHp}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-stone-500">{t('player.turn', locale)}</p>
          <p className="text-lg font-bold text-stone-200">{turnNumber}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-purple-400/70">
          {locale === 'en' ? 'Cards' : '카드'}
        </p>
        <p className="text-lg font-bold text-purple-300">{totalCards}/16</p>
      </div>
      {recentLog && (
        <p className="text-[9px] text-stone-500 truncate max-w-[100px] hidden sm:block">{recentLog.message}</p>
      )}
    </div>
  );
}

// ── Curse Card Modal ──
function CurseModal({ cards, locale, onClose }: { cards: { id: string; name: string; nameEn: string; effect: string; effectEn: string; penalty: string; penaltyEn: string }[]; locale: string; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-stone-900 border border-red-800 rounded-xl p-4 w-full max-w-xs" initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-red-400 mb-2">💀 {locale === 'en' ? 'Curse Cards' : '저주 카드'}</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {cards.map((c) => (
            <div key={c.id} className="bg-stone-800 rounded p-2 text-[11px]">
              <p className="font-bold text-stone-200">{locale === 'en' ? c.nameEn : c.name}</p>
              <p className="text-emerald-400 mt-0.5">{locale === 'en' ? c.effectEn : c.effect}</p>
              <p className="text-red-400">{locale === 'en' ? c.penaltyEn : c.penalty}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-3 w-full py-1.5 bg-stone-700 hover:bg-stone-600 rounded text-xs text-stone-200 transition-colors">{locale === 'en' ? 'Close' : '닫기'}</button>
      </motion.div>
    </motion.div>
  );
}
