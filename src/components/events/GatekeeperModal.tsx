'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import TimingSlider, { type SliderResult } from '@/components/battle/TimingSlider';
import CardMatch from '@/components/battle/CardMatch';
import RapidTap from '@/components/battle/RapidTap';
import QuizChallenge from '@/components/battle/QuizChallenge';
import { assetPath } from '@/lib/utils/assetPath';
import type { GatekeeperBattleType } from '@/types/game';

// ── Timing slider config per gatekeeper ──
function getTimingConfig(gkId: string, guardianCount: number) {
  switch (gkId) {
    case 'gk-9': // Ice — narrow + flicker
      return { greenWidth: 8, yellowWidth: 12, speed: 1.2, flicker: 500 as const };
    case 'gk-5': // Wrath — speed ramp
      return { greenWidth: 9, yellowWidth: 13, speed: 1.0, speedRamp: 0.15 };
    case 'gk-2': // Storm — speed variance
      return { greenWidth: 9, yellowWidth: 12, speed: 0.9, speedVar: 0.4 };
    case 'gk-1': // Virgil — ultra hard + reverse
      return { greenWidth: 5, yellowWidth: 10, speed: 0.55, reverse: true };
    default:
      return { greenWidth: 10, yellowWidth: 14, speed: 1.0 };
  }
}

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
  const bonusPct = useMemo(() => {
    let b = 0;
    if (guardianCards.some((g) => g?.id === 'guardian-3')) b += 5;
    if (guardianCards.some((g) => g?.id === 'guardian-5')) b += 3;
    if (guardianCards.some((g) => g?.id === 'guardian-6')) b += 2;
    if (guardianCards.some((g) => g?.id === 'guardian-1')) b = Math.floor(b * 1.5);
    return b;
  }, [guardianCards]);

  // ── Resolve helpers ──
  const resolveWithResult = useCallback((success: boolean, d6val?: number) => {
    setResult(success);
    setResolved(true);
    const roll = d6val ?? (success ? 6 : 1);
    setBattleRoll(roll);
  }, [setBattleRoll]);

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
  const timingCfg = (battleType === 'timing' || battleType === 'multitap' || battleType === 'final')
    ? getTimingConfig(gk.id, guardianCards.length)
    : null;

  // ── Render battle minigame ──
  const renderBattle = () => {
    switch (battleType) {
      // ── TimingSlider (GK-9 ice, GK-5 wrath, GK-2 storm) ──
      case 'timing': {
        if (!timingCfg) return null;
        const greenW = Math.max(3, Math.min(40, timingCfg.greenWidth + bonusPct));
        const yellowW = Math.max(5, Math.min(35, timingCfg.yellowWidth + bonusPct));
        return (
          <TimingSlider
            greenWidth={greenW}
            yellowWidth={yellowW}
            speed={timingCfg.speed}
            flickerInterval={timingCfg.flicker}
            speedRamp={timingCfg.speedRamp}
            speedVariance={timingCfg.speedVar}
            reverseDirection={timingCfg.reverse}
            tapPrompt={t('gk.tapPrompt', locale)}
            onResult={(r: SliderResult) => resolveWithResult(r !== 'defeat', r === 'critical' ? 6 : r === 'victory' ? 5 : 1)}
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

      // ── Rapid Tap (GK-7 blood) ──
      case 'rapidtap':
        return (
          <RapidTap
            targetTaps={15 + gk.power * 2}
            timeLimit={5}
            onResult={(success) => resolveWithResult(success, success ? 6 : 2)}
          />
        );

      // ── Quiz (GK-6 flame) ──
      case 'quiz':
        return (
          <QuizChallenge
            questionCount={3}
            requiredCorrect={2}
            showHint={hasLantern}
            onResult={(passed, score) => resolveWithResult(passed, passed ? 6 : score >= 1 ? 4 : 1)}
          />
        );

      // ── Choice (GK-4 gold) ──
      case 'choice':
        return resolved ? null : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                // Safe: 70% success
                const success = Math.random() < 0.7;
                resolveWithResult(success, success ? 5 : 2);
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-emerald-600/50"
            >
              🛡 {locale === 'en' ? 'Safe Path (70% win)' : '안전한 길 (70% 승리)'}
            </button>
            <button
              onClick={() => {
                // Gamble: 30% success, 3x reward
                const success = Math.random() < 0.3;
                resolveWithResult(success, success ? 6 : 1);
              }}
              className="w-full py-3 bg-red-800 hover:bg-red-700 text-red-200 font-bold rounded-xl text-sm active:scale-95 transition-transform border border-red-600/50"
            >
              ⚡ {locale === 'en' ? 'Gamble (30% win, 3x HP!)' : '도박 (30% 승리, 3배 HP!)'}
            </button>
          </div>
        );

      // ── MultiTap Timing (GK-3 cerberus) ──
      case 'multitap': {
        if (!timingCfg) return null;
        const greenW = Math.max(5, Math.min(40, (timingCfg.greenWidth || 12) + bonusPct));
        const yellowW = Math.max(5, Math.min(35, (timingCfg.yellowWidth || 14) + bonusPct));
        return (
          <TimingSlider
            greenWidth={greenW}
            yellowWidth={yellowW}
            speed={timingCfg.speed || 0.9}
            multiTap={3}
            tapPrompt={t('gk.tapPrompt', locale)}
            onResult={(r: SliderResult) => resolveWithResult(r !== 'defeat', r === 'critical' ? 6 : r === 'victory' ? 5 : 1)}
          />
        );
      }

      // ── Final (GK-1 virgil) - quiz first, then timing ──
      case 'final': {
        if (resolved && result !== null) {
          // Phase 2: timing slider
          if (!timingCfg) return null;
          const greenW = Math.max(3, Math.min(40, timingCfg.greenWidth + bonusPct));
          const yellowW = Math.max(5, Math.min(35, timingCfg.yellowWidth + bonusPct));
          return (
            <TimingSlider
              greenWidth={greenW}
              yellowWidth={yellowW}
              speed={timingCfg.speed}
              reverseDirection={timingCfg.reverse}
              tapPrompt={t('gk.tapPrompt', locale)}
              onResult={(r: SliderResult) => {
                const success = r !== 'defeat';
                resolveWithResult(success, r === 'critical' ? 6 : r === 'victory' ? 5 : 1);
              }}
            />
          );
        }
        // Phase 1: single quiz question
        return (
          <QuizChallenge
            questionCount={1}
            requiredCorrect={1}
            showHint={hasLantern}
            onResult={(passed, score) => {
              if (passed) {
                setResult(true);
                setResolved(true);
                // Don't call resolveWithResult yet - wait for timing phase
              } else {
                resolveWithResult(false, 1);
              }
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
              <object data={imgPath} type="image/svg+xml" className="w-full h-full">
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
            {bonusPct > 0 && (battleType === 'timing' || battleType === 'multitap' || battleType === 'final') && (
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">
                ✨ {t('gk.guardianBonus', locale, { n: bonusPct })}
              </p>
            )}
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
