'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  pairs: number;        // number of matching pairs (grid = pairs*2 cards)
  maxMistakes: number;  // wrong matches allowed before failing
  onResult: (success: boolean, score: number) => void;
}

const FACES = ['🔥', '❄️', '⚡', '🌙', '⭐', '🌹', '🗝️', '⚖️', '👑', '🕊️'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── MemoryFlip ──────────────────────────────────────────────────────────────
// Classic concentration: flip two cards, keep matched pairs. A limited number
// of mistakes are allowed. Found pairs = score.
export default function MemoryFlip({ pairs, maxMistakes, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const lockRef = useRef(false);
  const matchedRef = useRef<number[]>([]);
  const mistakesRef = useRef(0);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const finish = useCallback(() => {
    setPhase('done');
    const found = matchedRef.current.length / 2;
    setTimeout(() => onResultRef.current(found >= pairs, found), 500);
  }, [pairs]);

  const startGame = useCallback(() => {
    const faces = FACES.slice(0, pairs);
    setDeck(shuffle([...faces, ...faces]));
    setFlipped([]); setMatched([]); matchedRef.current = [];
    setMistakes(0); mistakesRef.current = 0;
    lockRef.current = false;
    setPhase('playing');
  }, [pairs]);

  useEffect(() => { /* no timers to clean */ }, []);

  const flipCard = useCallback((i: number) => {
    if (phase !== 'playing' || lockRef.current) return;
    if (flipped.includes(i) || matchedRef.current.includes(i)) return;

    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length < 2) return;

    lockRef.current = true;
    const [a, b] = nf;
    if (deck[a] === deck[b]) {
      setTimeout(() => {
        matchedRef.current = [...matchedRef.current, a, b];
        setMatched(matchedRef.current);
        setFlipped([]);
        lockRef.current = false;
        if (matchedRef.current.length / 2 >= pairs) finish();
      }, 380);
    } else {
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      setTimeout(() => {
        setFlipped([]);
        lockRef.current = false;
        if (mistakesRef.current > maxMistakes) finish();
      }, 700);
    }
  }, [phase, flipped, deck, pairs, maxMistakes, finish]);

  const cols = pairs <= 3 ? 3 : 4;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-violet-300 font-bold mb-2">
            {locale === 'en'
              ? `Find all ${pairs} pairs! (max ${maxMistakes} mistakes)`
              : `${pairs}쌍을 모두 찾아라! (실수 ${maxMistakes}회 허용)`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-violet-700 hover:bg-violet-600 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform border border-violet-400/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span className="text-violet-300">✦ {matched.length / 2}/{pairs}</span>
            <span className={mistakes >= maxMistakes ? 'text-red-400' : ''}>✗ {mistakes}/{maxMistakes}</span>
          </div>
          <div className={`grid gap-2 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {deck.map((face, i) => {
              const show = flipped.includes(i) || matched.includes(i);
              const isMatched = matched.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => flipCard(i)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl border-2 transition-all active:scale-95 ${
                    show
                      ? isMatched
                        ? 'bg-emerald-900/40 border-emerald-500/60'
                        : 'bg-violet-800/50 border-violet-400/60'
                      : 'bg-stone-800 border-stone-700 hover:border-stone-600'}`}
                >
                  {show ? face : <span className="text-stone-600 text-xl">✦</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <p className={`text-lg font-bold ${matched.length / 2 >= pairs ? 'text-emerald-400' : 'text-red-400'}`}>
          {matched.length / 2 >= pairs
            ? (locale === 'en' ? `✅ All ${pairs} pairs!` : `✅ ${pairs}쌍 완성!`)
            : (locale === 'en' ? `❌ ${matched.length / 2}/${pairs} pairs` : `❌ ${matched.length / 2}/${pairs}쌍`)}
        </p>
      )}
    </div>
  );
}
