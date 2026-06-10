'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  crystalCount: number;
  regenChance: number;
  timeLimit: number;
  onResult: (success: boolean) => void;
}

export default function CrystalBreak({ crystalCount, regenChance, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [crystals, setCrystals] = useState<boolean[]>([]);
  const [broken, setBroken] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setCrystals(Array.from({ length: crystalCount }, () => true));
    setBroken(0);
    setTimeLeft(timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          setTimeout(() => onResultRef.current(false), 500);
        }
        return next;
      });
      if (Math.random() < regenChance) {
        setCrystals((prev) => {
          const idx = prev.findIndex((c) => !c);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = true;
            return next;
          }
          return prev;
        });
      }
    }, 100);
  }, [crystalCount, regenChance, timeLimit]);

  const handleBreak = useCallback((idx: number) => {
    if (phase !== 'playing') return;
    setCrystals((prev) => {
      if (!prev[idx]) return prev;
      const next = [...prev];
      next[idx] = false;
      return next;
    });
    setBroken((prev) => {
      const next = prev + 1;
      if (next >= crystalCount) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true), 500);
      }
      return next;
    });
  }, [phase, crystalCount]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Break ${crystalCount} crystals!` : `${crystalCount}개의 수정을 파괴하라!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 text-cyan-200 font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}
      {phase === 'playing' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <p className="text-xs text-stone-500 mb-3">{broken}/{crystalCount}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {crystals.map((alive, i) => (
              <motion.button
                key={i}
                onClick={() => handleBreak(i)}
                disabled={!alive}
                className={`w-12 h-12 rounded-xl text-2xl transition-all active:scale-75 ${
                  alive ? 'bg-cyan-900/50 border-cyan-500 hover:bg-cyan-800' : 'bg-stone-900 border-stone-800 opacity-30'
                } border`}
                whileTap={{ scale: 0.7 }}
              >
                {alive ? '💎' : '✨'}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${broken >= crystalCount ? 'text-emerald-400' : 'text-red-400'}`}>
            {broken >= crystalCount
              ? (locale === 'en' ? '✅ All broken!' : '✅ 모두 파괴!')
              : (locale === 'en' ? '❌ Time up!' : '❌ 시간 초과!')}
          </p>
        </div>
      )}
    </div>
  );
}
