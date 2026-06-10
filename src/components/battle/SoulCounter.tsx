'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  duration: number;
  spawnRate: number;
  onResult: (success: boolean, score: number) => void;
}

interface Soul {
  id: number;
  x: number;
  startTime: number;
}

export default function SoulCounter({ duration, spawnRate, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'guess' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [souls, setSouls] = useState<Soul[]>([]);
  const [guess, setGuess] = useState('');
  const [actualCount, setActualCount] = useState(0);
  const soulIdRef = useRef(0);
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  const isRunningRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const spawnSoul = useCallback(() => {
    if (!isRunningRef.current) return;
    const id = ++soulIdRef.current;
    const x = 10 + Math.random() * 80;
    countRef.current += 1;
    setSouls((prev) => [...prev, { id, x, startTime: Date.now() }]);
    setTimeout(() => {
      setSouls((prev) => prev.filter((s) => s.id !== id));
    }, 1200);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setPhase('playing');
    setSouls([]);
    setGuess('');
    setTimeLeft(duration);
    countRef.current = 0;
    soulIdRef.current = 0;
    isRunningRef.current = true;

    spawnTimerRef.current = setInterval(spawnSoul, spawnRate);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearTimers();
        isRunningRef.current = false;
        setActualCount(countRef.current);
        setPhase('guess');
      }
    }, 100);
  }, [duration, spawnRate, clearTimers, spawnSoul]);

  const handleSubmit = useCallback(() => {
    const num = parseInt(guess, 10);
    const diff = Math.abs(num - actualCount);
    const success = diff <= 2;
    setPhase('done');
    setTimeout(() => onResultRef.current(success, success ? 5 : 0), 500);
  }, [guess, actualCount]);

  const timePct = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Count the souls! (${duration}s)` : `영혼의 수를 세라! (${duration}초)`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-sky-800 hover:bg-sky-700 text-sky-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-sky-600/50">
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
            <span>{locale === 'en' ? 'Count!' : '세세요!'}</span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>
          <div className="relative w-full h-44 bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(30,50,80,0.3),transparent)]" />
            <AnimatePresence>
              {souls.map((soul) => (
                <motion.div
                  key={soul.id}
                  initial={{ y: 160, opacity: 0, scale: 0.5 }}
                  animate={{ y: -20, opacity: [0, 0.9, 0.6, 0], scale: [0.5, 1, 1.1, 0.8] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute w-8 h-8 -translate-x-1/2 pointer-events-none"
                  style={{ left: `${soul.x}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-sky-400/20 border border-sky-300/40 shadow-lg shadow-sky-400/20 flex items-center justify-center text-lg blur-[0.5px]">
                    👻
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-stone-700 pointer-events-none">
              {locale === 'en' ? 'Count the souls passing by!' : '지나가는 영혼을 세세요!'}
            </p>
          </div>
        </div>
      )}

      {phase === 'guess' && (
        <div className="w-full text-center">
          <p className="text-sm text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'How many souls passed?' : '몇 개의 영혼이 지나갔나요?'}
          </p>
          <div className="flex gap-2 justify-center mb-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-20 h-10 bg-stone-800 border border-stone-600 rounded-lg text-center text-lg font-bold text-amber-300 focus:outline-none focus:border-amber-500"
              placeholder="?"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="px-4 h-10 bg-sky-700 hover:bg-sky-600 text-sky-200 font-bold rounded-lg active:scale-95 transition-transform"
            >
              OK
            </button>
          </div>
          <p className="text-[10px] text-stone-500">
            {locale === 'en' ? '±2 allowed' : '±2 허용'}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${Math.abs(parseInt(guess || '0', 10) - actualCount) <= 2 ? 'text-emerald-400' : 'text-red-400'}`}>
            {Math.abs(parseInt(guess || '0', 10) - actualCount) <= 2
              ? (locale === 'en' ? `✅ Correct! (${actualCount})` : `✅ 정답! (${actualCount}개)`)
              : (locale === 'en' ? `❌ Answer: ${actualCount}` : `❌ 정답: ${actualCount}개`)}
          </p>
        </div>
      )}
    </div>
  );
}
