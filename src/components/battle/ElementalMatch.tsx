'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface MatchItem {
  id: number;
  label: string;
  pairId: number;
  type: 'symbol' | 'desc';
}

const PAIRS_KO = [
  { symbol: '❄️ 얼음', desc: '피해 감소', pairId: 1 },
  { symbol: '🔥 불꽃', desc: '공격력 상승', pairId: 2 },
  { symbol: '🌪 바람', desc: '이동력 증가', pairId: 3 },
  { symbol: '💰 황금', desc: '보상 증가', pairId: 4 },
  { symbol: '☠️ 독', desc: '지속 피해', pairId: 5 },
];

const PAIRS_EN = [
  { symbol: '❄️ Ice', desc: 'Damage reduction', pairId: 1 },
  { symbol: '🔥 Fire', desc: 'Attack power up', pairId: 2 },
  { symbol: '🌪 Wind', desc: 'Movement boost', pairId: 3 },
  { symbol: '💰 Gold', desc: 'Reward increase', pairId: 4 },
  { symbol: '☠️ Poison', desc: 'DoT damage', pairId: 5 },
];

interface Props {
  timeLimit: number;
  onResult: (success: boolean, score: number) => void;
}

export default function ElementalMatch({ timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selected, setSelected] = useState<MatchItem | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [mistakes, setMistakes] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const generateItems = useCallback(() => {
    const pairs = locale === 'en' ? PAIRS_EN : PAIRS_KO;
    const shuffled = [...pairs].sort(() => Math.random() - 0.5).slice(0, 4);
    const items: MatchItem[] = [];
    shuffled.forEach((p, i) => {
      items.push({ id: i * 2, label: p.symbol, pairId: p.pairId, type: 'symbol' });
      items.push({ id: i * 2 + 1, label: p.desc, pairId: p.pairId, type: 'desc' });
    });
    setItems(items.sort(() => Math.random() - 0.5));
  }, [locale]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setMatched([]);
    setMistakes(0);
    setSelected(null);
    setTimeLeft(timeLimit);
    generateItems();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          setTimeout(() => onResultRef.current(false, matched.length), 500);
        }
        return next;
      });
    }, 100);
  }, [timeLimit, generateItems, matched.length]);

  const handleClick = useCallback((item: MatchItem) => {
    if (phase !== 'playing') return;
    if (matched.includes(item.pairId)) return;
    if (selected === null) {
      setSelected(item);
      return;
    }
    if (selected.id === item.id) {
      setSelected(null);
      return;
    }
    if (selected.pairId === item.pairId && selected.type !== item.type) {
      const newMatched = [...matched, item.pairId];
      setMatched(newMatched);
      setSelected(null);
      if (newMatched.length >= 4) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true, newMatched.length), 500);
      }
    } else {
      setMistakes((m) => m + 1);
      setSelected(null);
      if (mistakes >= 2) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(false, matched.length), 500);
      }
    }
  }, [phase, selected, matched, mistakes]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'Match elements to effects!' : '원소와 효과를 짝지어라!'}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-teal-800 hover:bg-teal-700 text-teal-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-teal-600/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span>{matched.length}/4</span>
            <span>{locale === 'en' ? `Mistakes: ${mistakes}/3` : `실수: ${mistakes}/3`}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const isMatched = matched.includes(item.pairId);
              const isSelected = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  disabled={isMatched}
                  className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 border min-h-[44px] ${
                    isMatched
                      ? 'bg-teal-900/40 border-teal-600/30 text-teal-400/40'
                      : isSelected
                      ? 'bg-teal-700 border-teal-400 text-teal-100 shadow-lg shadow-teal-500/20'
                      : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${matched.length >= 4 ? 'text-emerald-400' : 'text-red-400'}`}>
            {matched.length >= 4
              ? (locale === 'en' ? '✅ All Matched!' : '✅ 전부 짝지음!')
              : (locale === 'en' ? `❌ Only ${matched.length}/4` : `❌ ${matched.length}/4`)}
          </p>
        </div>
      )}
    </div>
  );
}
