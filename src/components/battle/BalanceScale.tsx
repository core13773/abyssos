'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  duration: number;     // how many seconds to maintain balance
  sensitivity: number;  // how fast it drifts (higher = harder)
  onResult: (success: boolean) => void;
}

export default function BalanceScale({ duration, sensitivity, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'balancing' | 'done'>('ready');
  const [position, setPosition] = useState(50); // 0-100, 50 = center
  const [timeLeft, setTimeLeft] = useState(duration);
  const posRef = useRef(50);
  const driftDir = useRef(1);
  const animRef = useRef(0);
  const startTimeRef = useRef(0);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  const gameActiveRef = useRef(false);

  const startGame = useCallback(() => {
    setPhase('balancing');
    setPosition(50);
    posRef.current = 50;
    driftDir.current = Math.random() > 0.5 ? 1 : -1;
    setTimeLeft(duration);
    startTimeRef.current = Date.now();
    gameActiveRef.current = true;

    const animate = () => {
      if (!gameActiveRef.current) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        gameActiveRef.current = false;
        setPhase('done');
        // Success if position is within center zone (35-65)
        const finalPos = posRef.current;
        setTimeout(() => onResultRef.current(finalPos >= 35 && finalPos <= 65), 400);
        return;
      }

      // Natural drift + some randomness
      const drift = driftDir.current * sensitivity * 0.3 + (Math.random() - 0.5) * sensitivity * 0.15;
      let newPos = posRef.current + drift;
      if (newPos <= 0) { newPos = 0; driftDir.current = 1; }
      if (newPos >= 100) { newPos = 100; driftDir.current = -1; }
      posRef.current = newPos;
      setPosition(newPos);

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, [duration, sensitivity]);

  useEffect(() => {
    return () => {
      gameActiveRef.current = false;
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleTap = useCallback((side: 'left' | 'right') => {
    if (phase !== 'balancing') return;
    // Tap pushes in opposite direction
    posRef.current = Math.max(0, Math.min(100, posRef.current + (side === 'left' ? 3 : -3)));
    setPosition(posRef.current);
  }, [phase]);

  const timePct = (timeLeft / duration) * 100;
  const inSafeZone = position >= 35 && position <= 65;
  const inDanger = position <= 15 || position >= 85;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Keep balance for ${duration}s!` : `${duration}초간 균형을 유지하라!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-teal-700 hover:bg-teal-600 text-teal-200 font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'balancing' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%`, transition: 'width 0.1s linear' }} />
          </div>
          <p className="text-[10px] text-stone-500 mb-3">{timeLeft.toFixed(1)}s</p>

          {/* Balance bar */}
          <div className="relative w-full h-12 bg-stone-800 rounded-full border-2 border-stone-600 mb-2 overflow-hidden">
            {/* Safe zone markers */}
            <div className="absolute top-0 bottom-0 bg-emerald-600/20 border-x border-emerald-500/30" style={{ left: '35%', right: '35%' }} />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40" />
            {/* Indicator */}
            <motion.div
              className={`absolute top-0 w-3 h-full rounded-full shadow-lg z-10 ${inSafeZone ? 'bg-emerald-400 shadow-emerald-400/30' : inDanger ? 'bg-red-400 shadow-red-400/30' : 'bg-amber-400 shadow-amber-400/30'}`}
              style={{ left: `calc(${position}% - 6px)` }}
              animate={{ left: `calc(${position}% - 6px)` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Tap buttons */}
          <div className="flex gap-3 justify-center mt-3">
            <button
              onClick={() => handleTap('left')}
              className="w-20 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-teal-900 border border-stone-600 active:border-teal-500 text-lg font-bold transition-colors"
            >
              ⬅
            </button>
            <div className="text-[10px] text-stone-600 flex items-center">{locale === 'en' ? 'TAP TO\nBALANCE' : '균형 유지'}</div>
            <button
              onClick={() => handleTap('right')}
              className="w-20 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-teal-900 border border-stone-600 active:border-teal-500 text-lg font-bold transition-colors"
            >
              ➡
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${position >= 35 && position <= 65 ? 'text-emerald-400' : 'text-red-400'}`}>
            {position >= 35 && position <= 65
              ? (locale === 'en' ? '✅ Balanced!' : '✅ 균형 유지!')
              : (locale === 'en' ? '❌ Fell over!' : '❌ 무너졌다!')}
          </p>
        </div>
      )}
    </div>
  );
}
