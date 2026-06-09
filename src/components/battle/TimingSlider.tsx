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
  // Gimmick props (optional)
  flickerInterval?: number;
  zoneShift?: boolean;
  jitter?: boolean;
  speedVariance?: number;
  speedRamp?: number;
  multiTap?: number;
  reverseDirection?: boolean;
  tapPrompt?: string;
  zoneLabels?: { miss: string; hit: string; crit: string };
}

export default function TimingSlider({
  greenWidth,
  yellowWidth,
  speed,
  onResult,
  disabled,
  flickerInterval,
  zoneShift,
  jitter,
  speedVariance,
  speedRamp,
  multiTap,
  reverseDirection,
  tapPrompt,
  zoneLabels,
}: Props) {
  // ── Safe defaults ──
  const safeGreen = Math.max(3, greenWidth);
  const safeYellow = Math.max(5, yellowWidth);
  const safeSpeed = Math.max(0.2, speed);

  // ── State ──
  const [position, setPosition] = useState(0);
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [result, setResult] = useState<SliderResult | null>(null);
  const [flickerVisible, setFlickerVisible] = useState(true);
  const [zoneShiftOffset, setZoneShiftOffset] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  // ── Refs ──
  const animRef = useRef(0);
  const posRef = useRef(0);
  const dirRef = useRef(reverseDirection ? -1 : 1);
  const lastTimeRef = useRef(0);
  const stoppedRef = useRef(false);
  const startedRef = useRef(false);
  const flickerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shiftTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapResultsRef = useRef<SliderResult[]>([]);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult; // always current

  // ── Flicker timer ──
  useEffect(() => {
    if (!flickerInterval || !started || stopped) return;
    flickerTimerRef.current = setInterval(() => {
      setFlickerVisible((v) => !v);
    }, flickerInterval);
    return () => {
      if (flickerTimerRef.current) { clearInterval(flickerTimerRef.current); flickerTimerRef.current = null; }
    };
  }, [flickerInterval, started, stopped]);

  // ── Zone shift timer ──
  useEffect(() => {
    if (!zoneShift || !started || stopped) return;
    shiftTimerRef.current = setInterval(() => {
      setZoneShiftOffset((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3);
        return Math.max(-15, Math.min(15, next));
      });
    }, 400);
    return () => {
      if (shiftTimerRef.current) { clearInterval(shiftTimerRef.current); shiftTimerRef.current = null; }
    };
  }, [zoneShift, started, stopped]);

  // ── Main animation loop ──
  useEffect(() => {
    if (!started || stopped || disabled) return;
    startedRef.current = true;

    const totalRange = 200;
    const pxPerMs = totalRange / (safeSpeed * 1000);
    lastTimeRef.current = performance.now();

    const animate = () => {
      if (stoppedRef.current) return;
      const now = performance.now();
      const dt = Math.min(now - lastTimeRef.current, 50);
      lastTimeRef.current = now;

      let dist = dt * pxPerMs;

      // Speed variance (wind)
      if (speedVariance && Math.random() < 0.003) {
        const variance = 1 + (Math.random() - 0.5) * 2 * speedVariance;
        dist = dist / Math.max(0.25, variance);
      }

      // Speed ramp (wrath)
      if (speedRamp && missCount > 0) {
        dist = dist * (1 + missCount * speedRamp);
      }

      const dir = dirRef.current;
      let newPos = posRef.current + dir * dist;

      // Jitter
      if (jitter && Math.random() < 0.1) {
        newPos += (Math.random() - 0.5) * 12;
      }

      // Bounce
      if (newPos >= 98) { newPos = 98 - (newPos - 98); dirRef.current = -1; }
      else if (newPos <= -98) { newPos = -98 - (newPos + 98); dirRef.current = 1; }

      posRef.current = newPos;
      setPosition(Math.max(-98, Math.min(98, newPos)));

      if (!stoppedRef.current && !disabled) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      stoppedRef.current = true;
      cancelAnimationFrame(animRef.current);
    };
  }, [started, stopped, disabled, safeSpeed, speedVariance, speedRamp, jitter, missCount]);

  // ── Resolve a single tap ──
  const resolveTap = useCallback((): SliderResult => {
    const absPos = Math.abs(posRef.current);
    const halfGreen = safeGreen / 2;
    const halfYellow = halfGreen + safeYellow;
    if (absPos <= halfGreen) return 'critical';
    if (absPos <= halfYellow) return 'victory';
    return 'defeat';
  }, [safeGreen, safeYellow]);

  // ── Tap handler ──
  const handleTap = useCallback(() => {
    if (disabled || stoppedRef.current) return;

    if (!startedRef.current) {
      setStarted(true);
      startedRef.current = true;
      // Start indicator at random edge position (away from center green zone)
      // so quick double-tapping can't guarantee a free critical hit
      const startPos = (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 25); // ±70~95
      posRef.current = startPos;
      setPosition(startPos);
      // Set direction toward center from the edge
      dirRef.current = startPos > 0 ? -1 : 1;
      return;
    }

    const tapRes = resolveTap();

    if (multiTap && multiTap > 1) {
      tapResultsRef.current = [...tapResultsRef.current, tapRes];
      const newCount = tapResultsRef.current.length;
      setTapCount(newCount);

      if (tapRes === 'defeat') {
        setMissCount((c) => c + 1);
      }

      if (newCount >= multiTap) {
        stoppedRef.current = true;
        cancelAnimationFrame(animRef.current);
        setStopped(true);

        const successes = tapResultsRef.current.filter((r) => r !== 'defeat').length;
        const finalResult: SliderResult = successes >= Math.ceil(multiTap * 0.5)
          ? (successes >= multiTap ? 'critical' : 'victory')
          : 'defeat';

        setResult(finalResult);
        setTimeout(() => { try { onResultRef.current(finalResult); } catch { /* ignore */ } }, 500);
      }
      return;
    }

    // Single tap
    stoppedRef.current = true;
    cancelAnimationFrame(animRef.current);
    setStopped(true);

    if (tapRes === 'defeat') {
      setMissCount((c) => c + 1);
    }

    setResult(tapRes);
    setTimeout(() => { try { onResultRef.current(tapRes); } catch { /* ignore */ } }, 500);
  }, [disabled, multiTap, resolveTap]);

  // ── Computed values ──
  const effectiveShift = zoneShift ? zoneShiftOffset : 0;
  const indicatorPx = (posRef.current / 100) * 50;
  const halfGreenPx = safeGreen / 2;
  const halfYellowPx = halfGreenPx + safeYellow;

  const missLabel = zoneLabels?.miss || 'MISS';
  const hitLabel = zoneLabels?.hit || 'HIT';
  const critLabel = zoneLabels?.crit || '✦';

  const showFlicker = !flickerInterval || flickerVisible;

  return (
    <div className="w-full select-none" onClick={handleTap}>
      {/* Zone bar */}
      <div className="relative h-14 rounded-full overflow-hidden border-2 border-stone-500 bg-stone-800 cursor-pointer mb-2">
        {/* Red zones */}
        <div className="absolute inset-0 bg-red-900/40" />

        {/* Yellow zones */}
        <div
          className="absolute top-0 bottom-0 bg-yellow-600/30"
          style={{
            left: `${50 - halfYellowPx + effectiveShift}%`,
            right: `${50 - halfYellowPx - effectiveShift}%`,
          }}
        />

        {/* Green zone */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/40"
          style={{
            left: `${50 - halfGreenPx + effectiveShift}%`,
            right: `${50 - halfGreenPx - effectiveShift}%`,
          }}
        />

        {/* Center marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 pointer-events-none" />

        {/* Indicator */}
        <div
          className="absolute top-1 bottom-1 w-2.5 bg-white rounded-full shadow-lg shadow-white/30 z-10"
          style={{
            left: `calc(${50 + indicatorPx}% - 5px)`,
            opacity: showFlicker ? 1 : 0,
          }}
        />

        {/* Multi-tap counter */}
        {multiTap && !stopped && tapCount > 0 && (
          <div className="absolute top-0 right-2 bottom-0 flex items-center z-20 pointer-events-none">
            <span className="text-white/70 text-xs font-bold">{tapCount}/{multiTap}</span>
          </div>
        )}

        {/* Prompt text */}
        {!stopped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <span className="text-white/80 text-base font-bold drop-shadow-lg">
              {!started
                ? (tapPrompt || '👆 TAP TO START')
                : multiTap
                  ? `👆 TAP! (${tapCount}/${multiTap})`
                  : '👆 TAP!'}
            </span>
          </div>
        )}

        {/* Result overlay */}
        {stopped && result && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
            <span className={`text-lg font-bold px-4 py-1.5 rounded-full ${
              result === 'critical' ? 'bg-emerald-500 text-white' :
              result === 'victory' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
            }`}>
              {result === 'critical' ? '🌟 CRITICAL!' : result === 'victory' ? '⚔ VICTORY' : '💀 DEFEAT'}
            </span>
          </div>
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
