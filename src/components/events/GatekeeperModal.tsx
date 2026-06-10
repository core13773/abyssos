'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import CardMatch from '@/components/battle/CardMatch';
import RapidTap from '@/components/battle/RapidTap';
import ColorSequence from '@/components/battle/ColorSequence';
import PatternMemory from '@/components/battle/PatternMemory';
import NumberMemory from '@/components/battle/NumberMemory';
import RhythmTap from '@/components/battle/RhythmTap';
import WhackMole from '@/components/battle/WhackMole';
import DiceBet from '@/components/battle/DiceBet';
import SlidingPuzzle from '@/components/battle/SlidingPuzzle';
import { assetPath } from '@/lib/utils/assetPath';
import type { GatekeeperBattleType } from '@/types/game';

export default function GatekeeperModal() {
  const phase = useGameStore((s) => s.phase);
  const gk = useGameStore((s) => s.activeGatekeeper);
  const player = useGameStore((s) => s.player);
  const setBattleRoll = useGameStore((s) => s.setBattleRoll);
  const resolveGatekeeperAction = useGameStore((s) => s.resolveGatekeeperAction);
  const locale = useLocale((s) => s.locale);

  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  // ── Guardian bonuses ──
  const guardianCards = player?.guardianCards ?? [];
  const hasLantern = guardianCards.some((g) => g?.id === 'guardian-6');

  // ── Resolve helpers ──
  const resolveWithResult = useCallback((success: boolean, d6val?: number) => {
    setResult(success);
    setResolved(true);
    const gkPower = gk?.power ?? 6;
    // Mini-game success guarantees gatekeeper defeat
    const roll = d6val ?? (success ? Math.max(6, gkPower) : Math.max(1, gkPower - 3));
    setBattleRoll(roll);
  }, [setBattleRoll, gk?.power]);

  const handleContinue = useCallback(() => {
    resolveGatekeeperAction();
  }, [resolveGatekeeperAction]);

  // ── Pre-damage for GK-7 ──
  const preDamageDone = useRef(false);
  useEffect(() => {
    if (gk?.id !== 'gk-7' || preDamageDone.current || resolved) return;
    preDamageDone.current = true;
    try {
      const state = useGameStore.getState();
      if (state.player) {
        const p = { ...state.player, buffs: [...(state.player.buffs ?? [])] };
        p.hp = Math.max(0, p.hp - 2);
        useGameStore.setState({ player: p });
      }
    } catch { /* ignore */ }
  }, [gk?.id, resolved]);

  // ── Early return ──
  if (phase !== 'gatekeeper' || !gk) return null;

  // ── Safe derived values ──
  const name = locale === 'en' ? gk.nameEn : gk.name;
  const title = locale === 'en' ? gk.titleEn : gk.title;
  const mechanic = locale === 'en' ? gk.mechanicEn : gk.mechanic;
  const imgPath = assetPath(`/images/${locale}/gatekeepers/${gk.id}.svg`);
  const battleType: GatekeeperBattleType = gk.battleType;

  // ── Timing slider config (if applicable) ──
  // ── Render battle minigame ──
  const renderBattle = () => {
    switch (battleType) {
      // ── Diverse mini-games for Gatekeepers (NO TimingSlider) ──
      case 'timing': {
        if (gk.id === 'gk-9') {
          // GK-9 Ice Goliath: Frozen number memory
          return (
            <NumberMemory
              digits={5}
              memorizeTime={2000}
              onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
            />
          );
        }
        if (gk.id === 'gk-5') {
          // GK-5 Avatar of Wrath: Rapid tapping frenzy
          return (
            <RapidTap
              targetTaps={22}
              timeLimit={5}
              onResult={(success) => resolveWithResult(success, success ? 6 : 2)}
            />
          );
        }
        // GK-2 Storm Wraith: Rhythm game (storm beat)
        return (
          <RhythmTap
            beatCount={5}
            bpm={130}
            tolerance={200}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
          />
        );
      }

      // ── Card Match (GK-8 masks) ──
      case 'cardmatch':
        return (
          <CardMatch
            cardCount={gk.power <= 5 ? 3 : 4}
            shuffleSpeed={0.3}
            showHint={hasLantern}
            removeTrap={false}
            onResult={(correct: boolean) => resolveWithResult(correct, correct ? 6 : 2)}
          />
        );

      // ── WhackMole (GK-7 blood) ──
      case 'rapidtap':
        return (
          <WhackMole
            targetCount={8}
            appearTime={650}
            spawnInterval={750}
            totalTime={9}
            onResult={(success) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      // ── Quiz (GK-6 flame inquisitor): Memory pattern as quiz proxy ──
      case 'quiz':
        return (
          <PatternMemory
            patternLength={4}
            memorizeTime={2200}
            label={locale === 'en' ? 'Memorize the truth!' : '진실을 기억하세요!'}
            onResult={(success) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      // ── DiceBet (GK-4 gold) ──
      case 'choice':
        return (
          <DiceBet
            requiredWins={2}
            totalRounds={3}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      // ── SlidingPuzzle (GK-3 cerberus) ──
      case 'multitap':
        return (
          <SlidingPuzzle
            size={3}
            maxMoves={12}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      // ── Final (GK-1 virgil) - pattern memory + rapid tap ──
      case 'final': {
        if (resolved && result !== null) {
          // Phase 2: rapid tap
          return (
            <RapidTap
              targetTaps={30}
              timeLimit={6}
              onResult={(success) => resolveWithResult(success, success ? 6 : 1)}
            />
          );
        }
        // Phase 1: pattern memory
        return (
          <PatternMemory
            patternLength={3}
            memorizeTime={2000}
            label={locale === 'en' ? 'Memorize the pattern!' : '패턴을 기억하세요!'}
            onResult={(success) => {
              if (success) { setResult(true); setResolved(true); }
              else { resolveWithResult(false, 1); }
            }}
          />
        );
      }

      default:
        return <p className="text-center text-stone-400 text-sm">Unknown battle type</p>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="gk-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          {/* Header: card image + name + power */}
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[100px] aspect-[750/1050] rounded-lg overflow-hidden border border-purple-700/50 shadow-lg">
              <object data={imgPath} type="image/svg+xml" className="w-full h-full" aria-label={`${name} — ${title}`} role="img">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-3xl">👹</div>
              </object>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {t('gk.appeared', locale)}
              </span>
              <h2 className="text-base font-bold text-amber-300 font-serif truncate">{name}</h2>
              <p className="text-[11px] text-stone-400 italic">{title}</p>
              <div className="flex gap-2 mt-1">
                <p className="text-amber-400 font-bold text-xl font-serif">
                  <span className="text-[9px] text-stone-500 block">{locale === 'en' ? 'POWER' : '파워'}</span>
                  {gk.power}
                </p>
                <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full self-start mt-1">
                  {battleType === 'timing' ? '🎯 Timing' :
                   battleType === 'cardmatch' ? '🃏 Cards' :
                   battleType === 'rapidtap' ? '⚡ Speed' :
                   battleType === 'quiz' ? '📜 Quiz' :
                   battleType === 'choice' ? '🎲 Choice' :
                   battleType === 'multitap' ? '👆 Multi' :
                   battleType === 'final' ? '👑 Final' : '???'}
                </span>
              </div>
            </div>
          </div>

          {/* Mechanic description */}
          <div className="bg-stone-800/70 rounded-lg p-2.5 mb-2 border border-stone-700">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-0.5">
              {locale === 'en' ? '⚡ MECHANIC' : '⚡ 전투 방식'}
            </p>
            <p className="text-[11px] text-stone-300 leading-relaxed">{mechanic}</p>
          </div>

          {/* Battle area */}
          <div className="mb-3">
            {renderBattle()}
          </div>

          {/* Continue button (after result) */}
          {resolved && result !== null && battleType !== 'final' && (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-1 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? (locale === 'en' ? '✅ SUCCESS!' : '✅ 성공!') : (locale === 'en' ? '❌ FAILED!' : '❌ 실패!')}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Resolve ▶' : '결과 확인 ▶'}
              </Button>
            </div>
          )}

          {/* For GK-1: show continue after BOTH phases complete */}
          {resolved && result !== null && battleType === 'final' && (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-1 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? (locale === 'en' ? '✅ ESCAPE!' : '✅ 탈출!') : (locale === 'en' ? '❌ FAILED!' : '❌ 실패!')}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Resolve ▶' : '결과 확인 ▶'}
              </Button>
            </div>
          )}

          {/* Reward/Penalty summary */}
          <div className="flex gap-2 text-[10px] justify-center mt-2">
            <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full">
              ✅ HP+{gk.rewardHp} + 🃏
            </span>
            <span className="text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full">
              ❌ HP-{gk.penaltyHp} ←{gk.pushback}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
