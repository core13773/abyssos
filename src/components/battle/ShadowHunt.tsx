'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  targetCount: number;
  spawnInterval: number;
  visibleTime: number;
  totalTime: number;
  onResult: (success: boolean, score: number) => void;
}

export default function ShadowHunt({ targetCount, spawnInterval, visibleTime, totalTime, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [shadow, setShadow] = useState<{ x: number; y: number; id: number } | null>(null);
  const scoreRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  const isRunningRef = useRef(false);
  const shadowIdRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const spawnShadow = useCallback(() => {
    if (!isRunningRef.current) return;
    const id = ++shadowIdRef.current;
    const x = 15 + Math.random() * 70;
    const y = 15 + Math.random() * 70;
    setShadow({ x, y, id });
    hideTimerRef.current = setTimeout(() => {
      setShadow((s) => (s?.id === id ? null : s));
    }, visibleTime);
  }, [visibleTime]);

  const startGame = useCallback(() => {
    clearTimers();
    setPhase('playing');
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(totalTime);
    isRunningRef.current = true;
    shadowIdRef.current = 0;

    spawnShadow();
    spawnTimerRef.current = setInterval(spawnShadow, spawnInterval);

    const startTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, totalTime - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearTimers();
        isRunningRef.current = false;
        setPhase('done');
        setTimeout(() => onResultRef.current(scoreRef.current >= targetCount, scoreRef.current), 500);
      }
    }, 100);
  }, [totalTime, spawnInterval, targetCount, clearTimers, spawnShadow]);

  const handleCatch = useCallback(() => {
    if (!isRunningRef.current || !shadow) return;
    setShadow(null);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    if (scoreRef.current >= targetCount) {
      clearTimers();
      isRunningRef.current = false;
      setPhase('done');
      setTimeout(() => onResultRef.current(true, scoreRef.current), 400);
    }
  }, [shadow, targetCount, clearTimers]);

  const timePct = (timeLeft / totalTime) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Hunt ${targetCount} shadows! (${totalTime}s)` : `그림자 ${targetCount}개를 사냥하라! (${totalTime}초)`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-stone-600/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%`, transition: 'width 0.1s linear' }} />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span>{score}/{targetCount}</span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>
          <div
            className="relative w-full h-44 bg-black rounded-xl border border-stone-800 overflow-hidden cursor-crosshair"
            onClick={() => { if (shadow) handleCatch(); }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,35,0.8),rgba(0,0,0,1))]" />
            <AnimatePresence>
              {shadow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${shadow.x}%`, top: `${shadow.y}%` }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-900/60 border-2 border-purple-500/40 shadow-lg shadow-purple-500/20 flex items-center justify-center text-2xl blur-[1px]">
                    👤
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-stone-700 pointer-events-none">
              {locale === 'en' ? 'Tap the shadows!' : '그림자를 클릭하세요!'}
            </p>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${score >= targetCount ? 'text-emerald-400' : 'text-red-400'}`}>
            {score >= targetCount
              ? (locale === 'en' ? `✅ Hunted ${score}!` : `✅ ${score}개 사냥!`)
              : (locale === 'en' ? `❌ Only ${score}/${targetCount}` : `❌ ${score}/${targetCount}개`)}
          </p>
        </div>
      )}
    </div>
  );
}
