'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  targetCount: number;   // how many to whack
  appearTime: number;    // ms each target stays visible
  spawnInterval: number; // ms between spawns
  totalTime: number;     // total game time in seconds
  onResult: (success: boolean, score: number) => void;
}

const GRID = [
  { x: 10, y: 25 }, { x: 45, y: 20 }, { x: 80, y: 25 },
  { x: 20, y: 55 }, { x: 55, y: 50 }, { x: 85, y: 55 },
  { x: 10, y: 80 }, { x: 45, y: 78 }, { x: 80, y: 80 },
];

export default function WhackMole({ targetCount, appearTime, spawnInterval, totalTime, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const activeRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  const spawnedCountRef = useRef(0);
  const isRunningRef = useRef(false);
  const lastWhackTimeRef = useRef(0);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const startGame = useCallback(() => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    clearAllTimeouts();

    setPhase('playing');
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(totalTime);
    spawnedCountRef.current = 0;
    isRunningRef.current = true;

    const spawnEnemy = () => {
      if (!isRunningRef.current) return;
      let pos: number;
      do { pos = Math.floor(Math.random() * GRID.length); }
      while (pos === activeRef.current && GRID.length > 1);
      activeRef.current = pos;
      setActive(pos);
      spawnedCountRef.current++;

      const id = window.setTimeout(() => {
        if (activeRef.current === pos) {
          activeRef.current = null;
          setActive(null);
        }
      }, appearTime);
      timeoutsRef.current.push(id);
    };

    spawnEnemy();
    spawnTimerRef.current = setInterval(spawnEnemy, spawnInterval);

    const startTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, totalTime - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        isRunningRef.current = false;
        setPhase('done');
        const finalScore = scoreRef.current;
        const id = window.setTimeout(() => onResultRef.current(finalScore >= targetCount, finalScore), 500);
        timeoutsRef.current.push(id);
      }
    }, 100);
  }, [totalTime, appearTime, spawnInterval, targetCount, clearAllTimeouts]);

  const handleWhack = useCallback((idx: number) => {
    if (!isRunningRef.current) return;
    // Debounce to prevent double-firing on touch devices
    const now = Date.now();
    if (now - lastWhackTimeRef.current < 150) return;
    lastWhackTimeRef.current = now;
    if (activeRef.current === idx) {
      activeRef.current = null;
      setActive(null);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (scoreRef.current >= targetCount) {
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        clearAllTimeouts();
        isRunningRef.current = false;
        setPhase('done');
        const id = window.setTimeout(() => onResultRef.current(true, scoreRef.current), 400);
        timeoutsRef.current.push(id);
      }
    }
  }, [targetCount, clearAllTimeouts]);

  const timePct = (timeLeft / totalTime) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Whack ${targetCount} demons! (${totalTime}s)` : `악마 ${targetCount}마리를 잡아라! (${totalTime}초)`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-red-800 hover:bg-red-700 text-red-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-red-600/50">
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
          <div className="relative w-full h-44 bg-stone-900/60 rounded-xl border border-stone-700 overflow-hidden">
            {GRID.map((pos, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); handleWhack(i); }}
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform select-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="w-12 h-12 rounded-full bg-red-700 border-2 border-red-400 shadow-lg shadow-red-500/30 flex items-center justify-center text-2xl"
                    >
                      👹
                    </motion.div>
                  )}
                </AnimatePresence>
                {active !== i && (
                  <div className="w-10 h-10 mx-auto rounded-full bg-stone-800/50 border border-stone-700/30 flex items-center justify-center text-xs text-stone-600">
                    ●
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${score >= targetCount ? 'text-emerald-400' : 'text-red-400'}`}>
            {score >= targetCount
              ? (locale === 'en' ? `✅ Whacked ${score}!` : `✅ ${score}마리 잡았다!`)
              : (locale === 'en' ? `❌ Only ${score}/${targetCount}` : `❌ ${score}/${targetCount}마리`)}
          </p>
        </div>
      )}
    </div>
  );
}
