'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  gridSize: number;
  fogRadius: number;
  timeLimit: number;
  onResult: (success: boolean) => void;
}

export default function SmokeMaze({ gridSize, fogRadius, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [playerPos, setPlayerPos] = useState(0);
  const [goalPos, setGoalPos] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    // 난이도 prop(gridSize/timeLimit) 변경 시 게임 상태를 초기화 — 정당한 부작용.
    // key 기반 리셋은 부모 구조 변경이 필요해 effect에서 유지.
    /* eslint-disable react-hooks/set-state-in-effect */
    const total = gridSize * gridSize;
    setPlayerPos(0);
    setGoalPos(total - 1);
    setVisited(new Set([0]));
    setPhase('playing');
    setTimeLeft(timeLimit);
    /* eslint-enable react-hooks/set-state-in-effect */
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
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gridSize, timeLimit]);

  const move = useCallback((dx: number, dy: number) => {
    if (phase !== 'playing') return;
    setPlayerPos((prev) => {
      const x = prev % gridSize;
      const y = Math.floor(prev / gridSize);
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return prev;
      const next = ny * gridSize + nx;
      setVisited((v) => new Set([...v, next]));
      if (next === goalPos) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true), 500);
      }
      return next;
    });
  }, [phase, gridSize, goalPos]);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {phase === 'playing' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <p className="text-xs text-stone-500 mb-3">{locale === 'en' ? 'Find the exit!' : '출구를 찾으세요!'}</p>
          <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: `${gridSize * 36}px` }}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const px = playerPos % gridSize;
              const py = Math.floor(playerPos / gridSize);
              const ix = i % gridSize;
              const iy = Math.floor(i / gridSize);
              const dist = Math.abs(px - ix) + Math.abs(py - iy);
              const isVisible = dist <= fogRadius;
              const isPlayer = i === playerPos;
              const isGoal = i === goalPos;
              const isVisited = visited.has(i);
              return (
                <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center text-sm ${
                  isPlayer ? 'bg-amber-600 border-amber-400' :
                  isGoal && isVisible ? 'bg-emerald-800 border-emerald-500' :
                  isVisited ? 'bg-stone-700 border-stone-600' :
                  isVisible ? 'bg-stone-800 border-stone-700' :
                  'bg-stone-950 border-stone-900 opacity-50'
                }`}>
                  {isPlayer ? '🧙' : isGoal && isVisible ? '🚪' : ''}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 justify-center mt-3">
            <button onClick={() => move(0, -1)} className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-xl border border-stone-600">⬆</button>
          </div>
          <div className="flex gap-2 justify-center mt-1">
            <button onClick={() => move(-1, 0)} className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-xl border border-stone-600">⬅</button>
            <button onClick={() => move(0, 1)} className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-xl border border-stone-600">⬇</button>
            <button onClick={() => move(1, 0)} className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-xl border border-stone-600">➡</button>
          </div>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${playerPos === goalPos ? 'text-emerald-400' : 'text-red-400'}`}>
            {playerPos === goalPos
              ? (locale === 'en' ? '✅ Escaped!' : '✅ 탈출!')
              : (locale === 'en' ? '❌ Lost in smoke!' : '❌ 연기 속에서 길을 잃었다!')}
          </p>
        </div>
      )}
    </div>
  );
}
