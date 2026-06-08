'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  duration: number;  // seconds
  onResult: (taps: number) => void;
}

export default function RapidTap({ duration, onResult }: Props) {
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready');
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const tapAreaRef = useRef<HTMLDivElement>(null);
  const tapsRef = useRef(0);

  useEffect(() => {
    if (phase !== 'active') return;

    const startTime = performance.now();

    const timer = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setPhase('done');
        setTimeout(() => onResult(tapsRef.current), 500);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [phase, duration, onResult]);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (phase === 'ready') {
      setPhase('active');
      tapsRef.current = 1;
      setTaps(1);
      return;
    }

    if (phase === 'active') {
      tapsRef.current += 1;
      setTaps(tapsRef.current);
    }
  }, [phase]);

  const pct = (timeLeft / duration) * 100;

  const getGrade = (t: number) => {
    if (t >= 40) return { label: 'S', color: 'text-yellow-300', bg: 'bg-yellow-500' };
    if (t >= 30) return { label: 'A', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (t >= 20) return { label: 'B', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (t >= 10) return { label: 'C', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { label: 'D', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const grade = getGrade(taps);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase !== 'done' && (
        <>
          {/* Timer bar */}
          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${pct}%` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Tap area */}
          <div
            ref={tapAreaRef}
            className="w-full h-32 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{ background: 'rgba(217,119,6,0.15)' }}
            onClick={handleTap}
            onTouchStart={handleTap}
          >
            <div className="text-center">
              {phase === 'ready' && (
                <span className="text-white/70 text-xl font-bold animate-pulse">TAP TO START!</span>
              )}
              {phase === 'active' && (
                <>
                  <motion.span
                    key={taps}
                    className="text-4xl font-bold text-amber-400 block"
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {taps}
                  </motion.span>
                  <span className="text-sm text-amber-400/60">TAP RAPIDLY!</span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {phase === 'done' && (
        <motion.div
          className="text-center py-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >
          <p className="text-4xl font-bold text-amber-400">{taps}</p>
          <p className="text-sm text-stone-400">taps in {duration}s</p>
          <p className={`text-2xl font-bold mt-2 ${grade.color}`}>
            Grade {grade.label}
          </p>
        </motion.div>
      )}
    </div>
  );
}
