'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export type SliderResult = 'critical' | 'victory' | 'defeat';

interface Props {
  greenWidth: number;
  yellowWidth: number;
  speed: number;
  onResult: (result: SliderResult) => void;
  disabled?: boolean;
  // ── Gatekeeper gimmick props ──
  /** Indicator periodically goes invisible for this interval (ms) — Ice Goliath */
  flickerInterval?: number;
  /** Speed randomly changes by ±variance factor (0~1) — Storm Wraith */
  speedVariance?: number;
  /** Zones slowly drift left/right — Lord of Masks */
  zoneShift?: boolean;
  /** Indicator randomly jitters position — Flame Inquisitor */
  jitter?: boolean;
  /** Indicator moves in reverse direction — Shadow of Virgil */
  reverseDirection?: boolean;
  /** Speed multiplier that increases on each miss — Avatar of Wrath */
  speedRamp?: number;
  /** Require multiple successful taps — Cerberus (3 taps, need 2+) */
  multiTap?: number;
  /** Label override for the prompt text */
  tapPrompt?: string;
  /** Custom zone labels */
  zoneLabels?: { miss: string; hit: string; crit: string };
}

export default function TimingSlider({
  greenWidth,
  yellowWidth,
  speed,
  onResult,
  disabled,
  flickerInterval,
  speedVariance,
  zoneShift,
  jitter,
  reverseDirection,
  speedRamp,
  multiTap,
  tapPrompt,
  zoneLabels,
}: Props) {
  const [position, setPosition] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [result, setResult] = useState<SliderResult | null>(null);
  const [started, setStarted] = useState(false);
  const [flickerVisible, setFlickerVisible] = useState(true);
  const [zoneShiftOffset, setZoneShiftOffset] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [tapResults, setTapResults] = useState<SliderResult[]>([]);
  const [missCount, setMissCount] = useState(0);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const dirRef = useRef(reverseDirection ? -1 : 1);
  const lastTimeRef = useRef(0);
  const baseSpeedRef = useRef(speed);
  const flickerTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const shiftTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Effective speed with variance and ramp
  const getEffectiveSpeed = useCallback(() => {
    let s = baseSpeedRef.current;
    if (speedRamp && missCount > 0) {
      s = s / (1 + missCount * speedRamp); // faster = smaller number
    }
    if (speedVariance && started) {
      const variance = 1 + (Math.random() - 0.5) * 2 * speedVariance;
      s = s / variance;
    }
    return Math.max(0.2, Math.min(s, 4.0));
  }, [speedVariance, speedRamp, missCount, started]);

  // Flicker effect timer
  useEffect(() => {
    if (!flickerInterval || !started || stopped) return;
    flickerTimerRef.current = setInterval(() => {
      setFlickerVisible((v) => !v);
    }, flickerInterval);
    return () => { if (flickerTimerRef.current) clearInterval(flickerTimerRef.current); };
  }, [flickerInterval, started, stopped]);

  // Zone shift effect timer
  useEffect(() => {
    if (!zoneShift || !started || stopped) return;
    shiftTimerRef.current = setInterval(() => {
      setZoneShiftOffset((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3);
        return Math.max(-15, Math.min(15, next));
      });
    }, 400);
    return () => { if (shiftTimerRef.current) clearInterval(shiftTimerRef.current); };
  }, [zoneShift, started, stopped]);

  // Animation loop
  useEffect(() => {
    if (!started || stopped || disabled) return;

    baseSpeedRef.current = speed;
    const totalRange = 200;
    lastTimeRef.current = performance.now();
    let varianceTimer = 0;

    const animate = (now: number) => {
      const dt = Math.min(now - lastTimeRef.current, 50); // cap dt to prevent jumps
      lastTimeRef.current = now;

      // Apply speed variance periodically
      varianceTimer += dt;
      let currentSpeed = speed;
      if (speedVariance && varianceTimer > 300) {
        varianceTimer = 0;
        currentSpeed = getEffectiveSpeed();
        baseSpeedRef.current = currentSpeed;
      }
      if (speedRamp && missCount > 0) {
        currentSpeed = getEffectiveSpeed();
      }

      const pxPerMs = totalRange / (currentSpeed * 1000);
      const dist = dt * pxPerMs;
      const dir = dirRef.current;
      let newPos = posRef.current + dir * dist;

      // Apply jitter
      if (jitter && Math.random() < 0.15) {
        newPos += (Math.random() - 0.5) * 10;
      }

      // Bounce at edges
      if (newPos >= 98) {
        newPos = 98 - (newPos - 98);
        dirRef.current = -1;
      } else if (newPos <= -98) {
        newPos = -98 - (newPos + 98);
        dirRef.current = 1;
      }

      posRef.current = newPos;
      setPosition(newPos);

      if (!stopped && !disabled) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, stopped, disabled, speed, speedVariance, speedRamp, jitter, missCount, getEffectiveSpeed]);

  const resolveTapResult = useCallback((): SliderResult => {
    const absPos = Math.abs(posRef.current);
    const halfGreen = greenWidth / 2;
    const halfYellow = halfGreen + yellowWidth;

    if (absPos <= halfGreen) return 'critical';
    if (absPos <= halfYellow) return 'victory';
    return 'defeat';
  }, [greenWidth, yellowWidth]);

  const handleTap = useCallback(() => {
    if (disabled) return;

    if (!started) {
      setStarted(true);
      return;
    }
    if (stopped) return;

    const tapRes = resolveTapResult();

    if (multiTap && multiTap > 1) {
      const newTapResults = [...tapResults, tapRes];
      const newTapCount = tapCount + 1;
      setTapResults(newTapResults);
      setTapCount(newTapCount);

      if (tapRes === 'defeat') {
        setMissCount((c) => c + 1);
      }

      if (newTapCount >= multiTap) {
        cancelAnimationFrame(animRef.current);
        setStopped(true);

        // Count successes (critical or victory)
        const successes = newTapResults.filter((r) => r !== 'defeat').length;
        const needed = Math.ceil(multiTap * 0.5);
        const finalResult: SliderResult = successes >= needed
          ? (successes >= multiTap ? 'critical' : 'victory')
          : 'defeat';

        setResult(finalResult);
        setTimeout(() => onResult(finalResult), 600);
      }
      return;
    }

    cancelAnimationFrame(animRef.current);
    setStopped(true);

    if (tapRes === 'defeat') {
      setMissCount((c) => c + 1);
    }

    setResult(tapRes);
    setTimeout(() => onResult(tapRes), 600);
  }, [started, stopped, disabled, multiTap, tapCount, tapResults, resolveTapResult, onResult]);

  const effectiveShift = zoneShift ? zoneShiftOffset : 0;
  const indicatorPx = (posRef.current / 100) * 50;
  const halfGreenPx = greenWidth / 2;
  const halfYellowPx = halfGreenPx + yellowWidth;

  const missLabel = zoneLabels?.miss || 'MISS';
  const hitLabel = zoneLabels?.hit || 'HIT';
  const critLabel = zoneLabels?.crit || '✦';

  return (
    <div className="w-full select-none" onClick={handleTap}>
      {/* Zone bar */}
      <div className="relative h-14 rounded-full overflow-hidden border-2 border-stone-500 bg-stone-800 cursor-pointer mb-2">
        {/* Red zones (edges) */}
        <div className="absolute inset-0 bg-red-900/40" />

        {/* Yellow zones */}
        <div
          className="absolute top-0 bottom-0 bg-yellow-600/30 transition-[left,right] duration-300"
          style={{
            left: `${50 - halfYellowPx + effectiveShift}%`,
            right: `${50 - halfYellowPx - effectiveShift}%`,
          }}
        />

        {/* Green zone (center) */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/40 transition-[left,right] duration-300"
          style={{
            left: `${50 - halfGreenPx + effectiveShift}%`,
            right: `${50 - halfGreenPx - effectiveShift}%`,
          }}
        />

        {/* Center marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30" />

        {/* Indicator */}
        <motion.div
          className={`absolute top-1 bottom-1 w-2.5 bg-white rounded-full shadow-lg shadow-white/30 z-10 transition-opacity duration-100 ${
            flickerInterval && !flickerVisible ? 'opacity-0' : 'opacity-100'
          } ${jitter ? 'animate-none' : ''}`}
          style={{ left: `calc(${50 + indicatorPx}% - 5px)` }}
        />

        {/* Multi-tap progress */}
        {multiTap && multiTap > 1 && !stopped && tapCount > 0 && (
          <div className="absolute top-0 right-2 bottom-0 flex items-center z-20 pointer-events-none">
            <span className="text-white/70 text-xs font-bold">
              {tapCount}/{multiTap}
            </span>
          </div>
        )}

        {/* Prompt text */}
        {!stopped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <span className="text-white/80 text-base font-bold drop-shadow-lg">
              {!started
                ? (tapPrompt || '👆 TAP TO START')
                : multiTap && multiTap > 1
                  ? `👆 TAP! (${tapCount}/${multiTap})`
                  : '👆 TAP!'}
            </span>
          </div>
        )}

        {/* Result overlay */}
        {stopped && result && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 bg-black/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span
              className={`text-lg font-bold px-4 py-1.5 rounded-full ${
                result === 'critical'
                  ? 'bg-emerald-500 text-white'
                  : result === 'victory'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-red-500 text-white'
              }`}
            >
              {result === 'critical' ? '🌟 CRITICAL!' : result === 'victory' ? '⚔ VICTORY' : '💀 DEFEAT'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-[9px] text-stone-500 px-1">
        <span>{missLabel}</span>
        <span>{hitLabel}</span>
        <span>{critLabel}</span>
        <span>{hitLabel}</span>
        <span>{missLabel}</span>
      </div>
    </div>
  );
}
