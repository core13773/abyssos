'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  nodeCount: number;
  timeLimit: number;
  onResult: (success: boolean, score: number) => void;
}

export default function ChainReaction({ nodeCount, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'show' | 'play' | 'done'>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [clicked, setClicked] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [round, setRound] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const positions = useRef<{ x: number; y: number }[]>([]);
  if (positions.current.length === 0) {
    for (let i = 0; i < nodeCount; i++) {
      positions.current.push({
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 60,
      });
    }
  }

  const startRound = useCallback((currentRound: number, currentClicked: number[]) => {
    if (currentRound >= nodeCount) {
      setPhase('done');
      setTimeout(() => onResultRef.current(true, currentClicked.length), 500);
      return;
    }
    const seq = Array.from({ length: currentRound + 3 }, (_, i) => i);
    setSequence(seq);
    setClicked([]);
    setPhase('show');

    setTimeout(() => {
      setPhase('play');
      setTimeLeft(timeLimit);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = Math.max(0, prev - 0.1);
          if (next <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase('done');
            setTimeout(() => onResultRef.current(false, currentClicked.length), 500);
          }
          return next;
        });
      }, 100);
    }, 1200 + currentRound * 400);
  }, [nodeCount, timeLimit]);

  const startGame = useCallback(() => {
    positions.current = [];
    for (let i = 0; i < nodeCount; i++) {
      positions.current.push({
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 60,
      });
    }
    setRound(0);
    startRound(0, []);
  }, [startRound, nodeCount]);

  const handleClick = useCallback((idx: number) => {
    if (phase !== 'play') return;
    const expected = sequence[clicked.length];
    if (idx !== expected) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('done');
      setTimeout(() => onResultRef.current(false, clicked.length), 500);
      return;
    }
    const nextClicked = [...clicked, idx];
    setClicked(nextClicked);
    if (nextClicked.length >= sequence.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      const nextRound = round + 1;
      setRound(nextRound);
      setTimeout(() => startRound(nextRound, nextClicked), 400);
    }
  }, [phase, sequence, clicked, round, startRound]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'Memorize the order, then tap!' : '순서를 기억하고 클릭하세요!'}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-indigo-600/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {(phase === 'show' || phase === 'play') && (
        <div className="w-full">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span>{locale === 'en' ? `Round ${round + 1}` : `${round + 1}라운드`}</span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>
          <div className="relative w-full h-44 bg-stone-900/60 rounded-xl border border-stone-700 overflow-hidden">
            {sequence.map((idx) => {
              const pos = positions.current[idx];
              const isShown = phase === 'show' || clicked.includes(idx);
              const isNext = phase === 'play' && clicked.length === sequence.indexOf(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  disabled={phase === 'show'}
                  className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <AnimatePresence>
                    {(isShown || isNext) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: isShown ? 0.4 : 1 }}
                        exit={{ scale: 0 }}
                        className={`w-10 h-10 rounded-full border-2 shadow-lg flex items-center justify-center text-sm font-bold ${
                          isShown
                            ? 'bg-indigo-900/40 border-indigo-700/30 text-indigo-400/30'
                            : 'bg-indigo-700 border-indigo-400 shadow-indigo-500/30 text-indigo-200'
                        }`}
                      >
                        {idx + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isShown && !isNext && (
                    <div className="w-8 h-8 mx-auto rounded-full bg-stone-800/50 border border-stone-700/30" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-stone-500 text-center mt-1">
            {clicked.length}/{sequence.length}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${clicked.length >= nodeCount + 2 ? 'text-emerald-400' : 'text-red-400'}`}>
            {clicked.length >= nodeCount + 2
              ? (locale === 'en' ? '✅ Chain Complete!' : '✅ 연쇄 완료!')
              : (locale === 'en' ? '❌ Chain Broken!' : '❌ 연쇄 끊김!')}
          </p>
        </div>
      )}
    </div>
  );
}
