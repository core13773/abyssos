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
}

export default function TimingSlider({ greenWidth, yellowWidth, speed, onResult, disabled }: Props) {
  const [position, setPosition] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [result, setResult] = useState<SliderResult | null>(null);
  const [started, setStarted] = useState(false);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const lastTimeRef = useRef(0);

  // Animation loop
  useEffect(() => {
    if (!started || stopped || disabled) return;

    const totalRange = 200;
    const pxPerMs = totalRange / (speed * 1000);
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const dist = dt * pxPerMs;
      let newPos = posRef.current + dirRef.current * dist;

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
  }, [started, stopped, disabled, speed]);

  const handleTap = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (stopped || disabled) return;

    cancelAnimationFrame(animRef.current);
    setStopped(true);

    const absPos = Math.abs(posRef.current);
    const halfGreen = greenWidth / 2;
    const halfYellow = halfGreen + yellowWidth;

    let res: SliderResult;
    if (absPos <= halfGreen) res = 'critical';
    else if (absPos <= halfYellow) res = 'victory';
    else res = 'defeat';

    setResult(res);
    setTimeout(() => onResult(res), 600);
  }, [started, stopped, disabled, greenWidth, yellowWidth, onResult]);

  const indicatorPx = (posRef.current / 100) * 50;
  const halfGreenPx = greenWidth / 2;
  const halfYellowPx = halfGreenPx + yellowWidth;

  return (
    <div className="w-full select-none" onClick={handleTap}>
      {/* Zone bar */}
      <div className="relative h-14 rounded-full overflow-hidden border-2 border-stone-500 bg-stone-800 cursor-pointer mb-2">
        {/* Red zones (edges) */}
        <div className="absolute inset-0 bg-red-900/40" />

        {/* Yellow zones */}
        <div className="absolute top-0 bottom-0 bg-yellow-600/30"
             style={{ left: `${50 - halfYellowPx}%`, right: `${50 - halfYellowPx}%` }} />

        {/* Green zone (center) */}
        <div className="absolute top-0 bottom-0 bg-emerald-500/40"
             style={{ left: `${50 - halfGreenPx}%`, right: `${50 - halfGreenPx}%` }} />

        {/* Center marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30" />

        {/* Indicator */}
        <motion.div
          className="absolute top-1 bottom-1 w-2.5 bg-white rounded-full shadow-lg shadow-white/30 z-10"
          style={{ left: `calc(${50 + indicatorPx}% - 5px)` }}
        />

        {/* Prompt text */}
        {!stopped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <span className="text-white/80 text-base font-bold drop-shadow-lg">
              {!started ? '👆 TAP TO START' : '👆 TAP!'}
            </span>
          </div>
        )}

        {/* Result overlay */}
        {stopped && result && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 bg-black/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span className={`text-lg font-bold px-4 py-1.5 rounded-full ${
              result === 'critical' ? 'bg-emerald-500 text-white' :
              result === 'victory' ? 'bg-yellow-500 text-black' :
              'bg-red-500 text-white'
            }`}>
              {result === 'critical' ? '🌟 CRITICAL!' : result === 'victory' ? '⚔ VICTORY' : '💀 DEFEAT'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-[9px] text-stone-500 px-1">
        <span>MISS</span>
        <span>HIT</span>
        <span>✦</span>
        <span>HIT</span>
        <span>MISS</span>
      </div>
    </div>
  );
}
