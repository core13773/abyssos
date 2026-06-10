'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  nodeCount: number;    // number of nodes in the path
  timeLimit: number;    // seconds to trace the whole path
  onResult: (success: boolean, score: number) => void;
}

// Scatter nodes without heavy overlap on a 100x100 field.
function makeNodes(n: number): { x: number; y: number }[] {
  const nodes: { x: number; y: number }[] = [];
  let guard = 0;
  while (nodes.length < n && guard < 400) {
    guard++;
    const x = 12 + Math.random() * 76;
    const y = 12 + Math.random() * 76;
    if (nodes.every((p) => Math.hypot(p.x - x, p.y - y) > 22)) nodes.push({ x, y });
  }
  while (nodes.length < n) nodes.push({ x: 12 + Math.random() * 76, y: 12 + Math.random() * 76 });
  return nodes;
}

// ── LightPath ───────────────────────────────────────────────────────────────
// Trace the constellation: tap the glowing nodes in ascending order before the
// light fades. A calm path-following game that fits the celestial theme.
export default function LightPath({ nodeCount, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);
  const [next, setNext] = useState(0);
  const [timePct, setTimePct] = useState(100);
  const [wrong, setWrong] = useState<number | null>(null);

  const nextRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const finish = useCallback((reached: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('done');
    setTimeout(() => onResultRef.current(reached >= nodeCount, reached), 450);
  }, [nodeCount]);

  const startGame = useCallback(() => {
    setNodes(makeNodes(nodeCount));
    nextRef.current = 0; setNext(0);
    setPhase('playing');
    const start = Date.now();
    setTimePct(100);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, timeLimit * 1000 - (Date.now() - start));
      setTimePct((left / (timeLimit * 1000)) * 100);
      if (left <= 0) finish(nextRef.current);
    }, 50);
  }, [nodeCount, timeLimit, finish]);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const tapNode = useCallback((i: number) => {
    if (phase !== 'playing') return;
    if (i === nextRef.current) {
      nextRef.current += 1;
      setNext(nextRef.current);
      if (nextRef.current >= nodeCount) finish(nextRef.current);
    } else {
      // brief wrong flash, no reset (forgiving)
      setWrong(i);
      setTimeout(() => setWrong(null), 200);
    }
  }, [phase, nodeCount, finish]);

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-sky-300 font-bold mb-2">
            {locale === 'en'
              ? `Trace the path 1→${nodeCount} before the light fades! (${timeLimit}s)`
              : `빛이 사라지기 전에 1→${nodeCount} 순서로 이어라! (${timeLimit}초)`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-sky-700 hover:bg-sky-600 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform border border-sky-400/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-stone-500 mb-1">
            <span>{next}/{nodeCount}</span>
            <span className="text-sky-300">{locale === 'en' ? 'next:' : '다음:'} {next + 1}</span>
          </div>
          <div className="h-1 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-sky-400" style={{ width: `${timePct}%`, transition: 'width 0.05s linear' }} />
          </div>
          <div className="relative w-full h-52 bg-gradient-to-b from-indigo-950/70 to-stone-900 rounded-xl border border-indigo-800/50 overflow-hidden">
            {/* connecting lines already traced */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {nodes.slice(0, Math.max(1, next)).map((p, i) => {
                if (i === 0) return null;
                const a = nodes[i - 1];
                return <line key={i} x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke="#7dd3fc" strokeWidth="0.8" opacity="0.7" />;
              })}
            </svg>
            {nodes.map((p, i) => {
              const done = i < next;
              const isNext = i === next;
              return (
                <button
                  key={i}
                  onClick={() => tapNode(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold border-2 ${
                    done ? 'bg-sky-500/30 border-sky-400/40 text-sky-300'
                    : isNext ? 'bg-amber-400 border-amber-200 text-stone-900 animate-pulse shadow-[0_0_12px] shadow-amber-300'
                    : wrong === i ? 'bg-red-700 border-red-400 text-white'
                    : 'bg-indigo-700/70 border-indigo-400/50 text-indigo-100'}`}>
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <p className={`text-lg font-bold ${next >= nodeCount ? 'text-emerald-400' : 'text-red-400'}`}>
          {next >= nodeCount
            ? (locale === 'en' ? '✅ Path complete!' : '✅ 경로 완성!')
            : (locale === 'en' ? `❌ ${next}/${nodeCount} nodes` : `❌ ${next}/${nodeCount} 노드`)}
        </p>
      )}
    </div>
  );
}
