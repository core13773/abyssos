'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export type PrecisionResult = 'perfect' | 'great' | 'good' | 'miss';

interface Props {
  targetSize: number;   // % of radius that counts as PERFECT
  speed: number;        // seconds per expand/contract cycle
  onResult: (result: PrecisionResult) => void;
}

export default function PrecisionTap({ targetSize, speed, onResult }: Props) {
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready');
  const [scale, setScale] = useState(0.3);
  const [growing, setGrowing] = useState(true);
  const [result, setResult] = useState<PrecisionResult | null>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const directionRef = useRef(1);

  useEffect(() => {
    if (phase !== 'active') return;

    const totalRange = 1.0 - 0.3; // 0.3 to 1.0
    const pxPerMs = totalRange / (speed * 500); // half cycle = expand only
    startRef.current = performance.now();
    let lastScale = 0.3;
    directionRef.current = 1;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const distance = elapsed * pxPerMs;
      let newScale = lastScale + directionRef.current * distance;

      if (newScale >= 1.0) {
        newScale = 1.0;
        lastScale = 1.0;
        startRef.current = now;
        directionRef.current = -1;
      } else if (newScale <= 0.3) {
        newScale = 0.3;
        lastScale = 0.3;
        startRef.current = now;
        directionRef.current = 1;
      }

      setScale(newScale);
      if (phase === 'active') {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, speed]);

  const handleTap = useCallback(() => {
    if (phase === 'ready') {
      setPhase('active');
      return;
    }
    if (phase !== 'active') return;

    cancelAnimationFrame(animRef.current);
    setPhase('done');

    // Calculate accuracy: how close to the target ring (scale 0.7)
    const target = 0.7;
    const deviation = Math.abs(scale - target);
    const maxDev = targetSize / 100;

    let res: PrecisionResult;
    if (deviation <= maxDev * 0.3) res = 'perfect';
    else if (deviation <= maxDev) res = 'great';
    else if (deviation <= maxDev * 2.5) res = 'good';
    else res = 'miss';

    setResult(res);
    setTimeout(() => onResult(res), 600);
  }, [phase, scale, targetSize, onResult]);

  const targetScale = 0.7;
  const targetPx = targetScale * 140; // base circle is 140px radius

  return (
    <div className="flex flex-col items-center gap-3 select-none" onClick={handleTap}>
      {/* Target area */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-[280px] h-[280px] rounded-full border-2 border-stone-600" />

        {/* Target ring (static) */}
        <div
          className="absolute rounded-full border-2 border-amber-400/60"
          style={{ width: `${targetPx * 2}px`, height: `${targetPx * 2}px` }}
        />

        {/* Expanding/contracting circle */}
        <motion.div
          className="absolute rounded-full bg-amber-500/20 border-2 border-amber-400"
          style={{
            width: `${scale * 280}px`,
            height: `${scale * 280}px`,
          }}
        />

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {phase === 'ready' && (
            <span className="text-white/70 text-lg font-bold animate-pulse">TAP TO START</span>
          )}
          {phase === 'active' && (
            <span className="text-amber-400/60 text-sm">TAP!</span>
          )}
          {phase === 'done' && result && (
            <motion.span
              className={`text-xl font-bold px-4 py-2 rounded-full ${
                result === 'perfect' ? 'bg-emerald-500 text-white' :
                result === 'great' ? 'bg-yellow-500 text-black' :
                result === 'good' ? 'bg-orange-500 text-white' :
                'bg-red-500 text-white'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {result === 'perfect' ? '🌟 PERFECT!' :
               result === 'great' ? 'GREAT' :
               result === 'good' ? 'GOOD' : 'MISS'}
            </motion.span>
          )}
        </div>
      </div>

      {/* Result mapping */}
      {phase === 'done' && result && (
        <div className="text-center text-xs text-stone-400">
          {result === 'perfect' && '🎯 D6 = 6 (무조건 승리!)'}
          {result === 'great' && '🎯 D6 = 4~5'}
          {result === 'good' && '🎯 D6 = 2~3'}
          {result === 'miss' && '💀 D6 = 1'}
        </div>
      )}
    </div>
  );
}
