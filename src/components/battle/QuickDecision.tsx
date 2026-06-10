'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  rounds: number;       // number of symbols to judge
  target: number;       // correct calls needed to succeed
  perItemMs?: number;   // time allowed per symbol
  onResult: (success: boolean, score: number) => void;
}

// Symbols sorted to the LEFT (banish / sin) vs RIGHT (welcome / virtue).
const SIN = ['😈', '👹', '🐍', '🔥', '⚠️', '🩸'];
const VIRTUE = ['😇', '🕊️', '✨', '🌟', '💫', '🙏'];

// ── QuickDecision ───────────────────────────────────────────────────────────
// A symbol flashes; decide fast — banish demons LEFT, welcome the holy RIGHT.
// A snap-judgement game that rewards focus under time pressure.
export default function QuickDecision({ rounds, target, perItemMs = 1500, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [items, setItems] = useState<{ emoji: string; holy: boolean }[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const [timePct, setTimePct] = useState(100);

  const idxRef = useRef(0);
  const correctRef = useRef(0);
  const itemsRef = useRef<{ emoji: string; holy: boolean }[]>([]);
  const lockRef = useRef(false);
  const itemTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<(n: number) => void>(() => {});
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const clearTimer = () => { if (itemTimerRef.current) clearInterval(itemTimerRef.current); };

  const finish = useCallback(() => {
    clearTimer();
    setPhase('done');
    const ok = correctRef.current >= target;
    setTimeout(() => onResultRef.current(ok, correctRef.current), 450);
  }, [target]);

  const advance = useCallback((next: number) => {
    if (next >= itemsRef.current.length) { finish(); return; }
    idxRef.current = next;
    setIdx(next);
    lockRef.current = false;
    // per-item countdown
    clearTimer();
    const start = Date.now();
    setTimePct(100);
    itemTimerRef.current = setInterval(() => {
      const left = Math.max(0, perItemMs - (Date.now() - start));
      setTimePct((left / perItemMs) * 100);
      if (left <= 0) {
        clearTimer();
        if (!lockRef.current) {
          lockRef.current = true;
          setFlash('bad');
          setTimeout(() => { setFlash(null); advanceRef.current(idxRef.current + 1); }, 240);
        }
      }
    }, 40);
  }, [finish, perItemMs]);

  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  const startGame = useCallback(() => {
    const list = Array.from({ length: rounds }, () => {
      const holy = Math.random() < 0.5;
      const pool = holy ? VIRTUE : SIN;
      return { emoji: pool[Math.floor(Math.random() * pool.length)], holy };
    });
    itemsRef.current = list;
    setItems(list);
    correctRef.current = 0; setCorrect(0);
    setPhase('playing');
    advance(0);
  }, [rounds, advance]);

  useEffect(() => { return () => clearTimer(); }, []);

  const decide = useCallback((welcome: boolean) => {
    if (phase !== 'playing' || lockRef.current) return;
    lockRef.current = true;
    clearTimer();
    const cur = itemsRef.current[idxRef.current];
    const ok = cur && cur.holy === welcome;
    if (ok) { correctRef.current += 1; setCorrect(correctRef.current); setFlash('good'); }
    else setFlash('bad');
    setTimeout(() => { setFlash(null); advance(idxRef.current + 1); }, 240);
  }, [phase, advance]);

  const cur = items[idx];

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-1">
            {locale === 'en' ? 'Judge fast!' : '빠르게 판단하라!'}
          </p>
          <p className="text-[11px] text-stone-400 mb-2">
            {locale === 'en' ? '😈 → LEFT (banish)   |   😇 → RIGHT (welcome)' : '😈 → 왼쪽 (추방)   |   😇 → 오른쪽 (환영)'}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform border border-amber-400/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-stone-500 mb-1">
            <span>{idx + 1}/{rounds}</span>
            <span className="text-amber-400">✦ {correct}/{target}</span>
          </div>
          <div className="h-1 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-amber-500" style={{ width: `${timePct}%`, transition: 'width 0.04s linear' }} />
          </div>
          <div className={`relative w-full h-28 rounded-xl border flex items-center justify-center mb-2 transition-colors ${
            flash === 'good' ? 'bg-emerald-900/40 border-emerald-500' : flash === 'bad' ? 'bg-red-900/40 border-red-500' : 'bg-stone-800/60 border-stone-700'}`}>
            <span className="text-6xl">{cur?.emoji ?? '…'}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => decide(false)} className="flex-1 py-4 bg-red-800 hover:bg-red-700 text-red-100 font-bold rounded-xl active:scale-95 transition-transform border border-red-600/50">
              ◀ {locale === 'en' ? 'Banish' : '추방'}
            </button>
            <button onClick={() => decide(true)} className="flex-1 py-4 bg-sky-800 hover:bg-sky-700 text-sky-100 font-bold rounded-xl active:scale-95 transition-transform border border-sky-500/50">
              {locale === 'en' ? 'Welcome' : '환영'} ▶
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <p className={`text-lg font-bold ${correct >= target ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct >= target
            ? (locale === 'en' ? `✅ ${correct} correct!` : `✅ ${correct}개 정답!`)
            : (locale === 'en' ? `❌ ${correct}/${target}` : `❌ ${correct}/${target}`)}
        </p>
      )}
    </div>
  );
}
