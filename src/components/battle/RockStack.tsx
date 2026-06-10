'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  targetHeight: number;
  swayAmount: number;
  onResult: (success: boolean) => void;
}

export default function RockStack({ targetHeight, swayAmount, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [height, setHeight] = useState(0);
  const [sway, setSway] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setHeight(0);
    setSway(0);
    setTimeLeft(15);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 0.1;
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          setTimeout(() => onResultRef.current(height >= targetHeight), 500);
        }
        return next;
      });
      setSway(Math.sin(elapsed * 2) * swayAmount);
    }, 100);
  }, [targetHeight, swayAmount]);

  const handleStack = useCallback(() => {
    if (phase !== 'playing') return;
    setHeight((prev) => {
      const next = prev + 1;
      if (next >= targetHeight) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true), 500);
      }
      return next;
    });
  }, [phase, targetHeight]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / 15) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Stack ${targetHeight} rocks!` : `${targetHeight}개의 돌을 쌓아라!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-teal-700 hover:bg-teal-600 text-teal-200 font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}
      {phase === 'playing' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <p className="text-[10px] text-stone-500 mb-3">{timeLeft.toFixed(1)}s</p>
          <div className="relative w-32 h-48 mx-auto bg-stone-800/50 rounded-xl border border-stone-700 flex flex-col-reverse items-center justify-start p-2 gap-0.5">
            {Array.from({ length: height }).map((_, i) => (
              <motion.div key={i} className="w-10 h-6 bg-stone-600 rounded border border-stone-500" style={{ marginLeft: `${sway}px` }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} />
            ))}
            <p className="text-xs text-amber-400 font-bold">{height}/{targetHeight}</p>
          </div>
          <button onClick={handleStack} className="mt-3 px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '⬇ Stack!' : '⬇ 쌓기!'}
          </button>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${height >= targetHeight ? 'text-emerald-400' : 'text-red-400'}`}>
            {height >= targetHeight ? (locale === 'en' ? '✅ Perfect Stack!' : '✅ 완벽한 탑!') : (locale === 'en' ? '❌ Collapsed!' : '❌ 물너졌다!')}
          </p>
        </div>
      )}
    </div>
  );
}
