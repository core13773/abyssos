'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import TimingSlider, { type SliderResult } from '@/components/battle/TimingSlider';
import { assetPath } from '@/lib/utils/assetPath';

// ── Per-gatekeeper timing slider config ──
interface GkSliderConfig {
  greenWidth: number;
  yellowWidth: number;
  speed: number;
  flickerInterval?: number;
  zoneShift?: boolean;
  jitter?: boolean;
  speedVariance?: number;
  speedRamp?: number;
  multiTap?: number;
  reverseDirection?: boolean;
  preDamage?: number;
}

function getGkConfig(gkId: string, guardianCount: number): GkSliderConfig {
  switch (gkId) {
    case 'gk-9': // Ice Goliath — flicker
      return { greenWidth: 8, yellowWidth: 12, speed: 1.2, flickerInterval: 500 };
    case 'gk-8': // Lord of Masks — shifting zones
      return { greenWidth: 10, yellowWidth: 14, speed: 1.1, zoneShift: true };
    case 'gk-7': // Blood Sentinel — fast + pre-damage
      return { greenWidth: 10, yellowWidth: 12, speed: 0.8, preDamage: 2 };
    case 'gk-6': // Flame Inquisitor — jitter
      return { greenWidth: 9, yellowWidth: 12, speed: 1.0, jitter: true };
    case 'gk-5': // Avatar of Wrath — speed ramp
      return { greenWidth: 9, yellowWidth: 13, speed: 1.0, speedRamp: 0.15 };
    case 'gk-4': // Golden Golem — shrinks per guardian
      return {
        greenWidth: Math.max(3, 12 - guardianCount),
        yellowWidth: Math.max(5, 15 - guardianCount),
        speed: 1.0,
      };
    case 'gk-3': // Cerberus — triple tap
      return { greenWidth: 12, yellowWidth: 14, speed: 0.9, multiTap: 3 };
    case 'gk-2': // Storm Wraith — speed variance
      return { greenWidth: 9, yellowWidth: 12, speed: 0.9, speedVariance: 0.4 };
    case 'gk-1': // Shadow of Virgil — ultra hard
      return { greenWidth: 5, yellowWidth: 10, speed: 0.55, reverseDirection: true };
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

  const [sliderResult, setSliderResult] = useState<SliderResult | null>(null);
  const [resolved, setResolved] = useState(false);

  // ── Guardian bonus for green/yellow zone ──
  const guardianBonusPct = useMemo(() => {
    try {
      let bonus = 0;
      const cards = player?.guardianCards ?? [];
      if (cards.some((g) => g?.id === 'guardian-3')) bonus += 5;
      if (cards.some((g) => g?.id === 'guardian-5')) bonus += 3;
      if (cards.some((g) => g?.id === 'guardian-6')) bonus += 2;
      if (cards.some((g) => g?.id === 'guardian-1')) bonus = Math.floor(bonus * 1.5);
      return bonus;
    } catch { return 0; }
  }, [player?.guardianCards]);

  // ── Slider config ──
  const sliderConfig = useMemo(() => {
    if (!gk?.id) return { greenWidth: 10, yellowWidth: 14, speed: 1.0 };
    const base = getGkConfig(gk.id, player?.guardianCards?.length ?? 0);
    return {
      ...base,
      greenWidth: Math.max(3, Math.min(40, base.greenWidth + guardianBonusPct)),
      yellowWidth: Math.max(5, Math.min(35, base.yellowWidth + guardianBonusPct)),
    };
  }, [gk?.id, player?.guardianCards?.length, guardianBonusPct]);

  // ── Handlers ──
  const handleSliderResult = useCallback((result: SliderResult) => {
    try {
      setSliderResult(result);
      setResolved(true);
      const battleRoll = result === 'critical' ? 6 : result === 'victory' ? 5 : 1;
      setBattleRoll(battleRoll);
    } catch { /* ignore */ }
  }, [setBattleRoll]);

  const handleContinue = useCallback(() => {
    try {
      resolveGatekeeperAction();
    } catch { /* ignore */ }
  }, [resolveGatekeeperAction]);

  // ── Pre-damage for Blood Sentinel ──
  const preDamageDone = useRef(false);
  useEffect(() => {
    if (!gk?.id || !sliderConfig.preDamage || preDamageDone.current || resolved) return;
    preDamageDone.current = true;
    try {
      const state = useGameStore.getState();
      if (state.player) {
        const p = { ...state.player, buffs: [...(state.player.buffs ?? [])] };
        p.hp = Math.max(0, p.hp - (sliderConfig.preDamage ?? 0));
        useGameStore.setState({ player: p });
      }
    } catch { /* ignore */ }
  }, [gk?.id, sliderConfig.preDamage, resolved]);

  // ── Early return after ALL hooks ──
  if (phase !== 'gatekeeper' || !gk) return null;

  // ── Derived values (safe: gk is non-null here) ──
  const name = locale === 'en' ? gk.nameEn : gk.name;
  const title = locale === 'en' ? gk.titleEn : gk.title;
  const mechanic = locale === 'en' ? gk.mechanicEn : gk.mechanic;
  const gimmickLabel = locale === 'en' ? '⚡ UNIQUE GIMMICK' : '⚡ 고유 기믹';
  const targetLabel = locale === 'en' ? 'D6 TARGET' : 'D6 목표';
  const promptText = locale === 'en'
    ? 'Time your tap in the green zone!'
    : '녹색 존에 타이밍을 맞춰 탭하세요!';

  const zoneLabels = gk.id === 'gk-3'
    ? { miss: locale === 'en' ? 'FAIL' : '실패', hit: locale === 'en' ? 'PASS' : '통과', crit: locale === 'en' ? 'PERF' : '완벽' }
    : undefined;

  const imgPath = assetPath(`/images/${locale}/gatekeepers/${gk.id}.svg`);

  return (
    <AnimatePresence>
      <motion.div
        key="gatekeeper-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          {/* Card image + name + power */}
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
              <p className="text-amber-400 font-bold text-xl font-serif mt-1">
                <span className="text-[9px] text-stone-500 block">{targetLabel}</span>
                {gk.power}
              </p>
            </div>
          </div>

          {/* Mechanic + Gimmick */}
          <div className="bg-stone-800/70 rounded-lg p-2.5 mb-2 border border-stone-700">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-0.5">{gimmickLabel}</p>
            <p className="text-[11px] text-stone-300 leading-relaxed">{mechanic}</p>
            {guardianBonusPct > 0 && (
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">
                ✨ {t('gk.guardianBonus', locale, { n: guardianBonusPct })}
              </p>
            )}
            {sliderConfig.preDamage && !resolved && (
              <p className="text-[10px] text-red-400 mt-1 font-bold animate-pulse">
                {t('gk.preDamage', locale)}
              </p>
            )}
          </div>

          {/* Timing Slider or Result */}
          {!resolved ? (
            <div className="mb-3">
              <p className="text-center text-xs text-stone-400 mb-2">{promptText}</p>
              <TimingSlider
                greenWidth={sliderConfig.greenWidth}
                yellowWidth={sliderConfig.yellowWidth}
                speed={sliderConfig.speed}
                flickerInterval={sliderConfig.flickerInterval}
                zoneShift={sliderConfig.zoneShift}
                jitter={sliderConfig.jitter}
                speedVariance={sliderConfig.speedVariance}
                speedRamp={sliderConfig.speedRamp}
                multiTap={sliderConfig.multiTap}
                reverseDirection={sliderConfig.reverseDirection}
                tapPrompt={t('gk.tapPrompt', locale)}
                zoneLabels={zoneLabels}
                onResult={handleSliderResult}
              />
            </div>
          ) : (
            <div className="mb-3 text-center">
              <p className={`text-xl font-bold mb-1 ${
                sliderResult === 'critical' ? 'text-emerald-400' :
                sliderResult === 'victory' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {sliderResult === 'critical' ? '🌟 CRITICAL! D6=6' :
                 sliderResult === 'victory' ? '⚔ Hit! D6=5' : '💀 Miss! D6=1'}
              </p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px]">
                {locale === 'en' ? 'Resolve ▶' : '결과 확인 ▶'}
              </Button>
            </div>
          )}

          {/* Reward / Penalty summary */}
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
