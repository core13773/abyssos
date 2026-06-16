'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

const WORDS_KO = ['지옥', '연옥', '천국', '영혼', '구원', '심판', '영원', '빛', '어둠'];
const WORDS_EN = ['HELL', 'PURGE', 'HEAVEN', 'SOUL', 'SAVE', 'JUDGE', 'ETERNAL', 'LIGHT', 'DARK'];

interface Props {
  wordLength: number;
  distractCount: number;
  timeLimit: number;
  onResult: (success: boolean) => void;
}

export default function HiddenWord({ wordLength, distractCount, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'memorize' | 'find' | 'done'>('memorize');
  const [targetWord, setTargetWord] = useState('');
  const [letters, setLetters] = useState<string[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    // 난이도 prop 변경 시 무작위 단어를 뽑아 게임 상태를 초기화 — 정당한 부작용(Math.random 포함).
    /* eslint-disable react-hooks/set-state-in-effect */
    const words = locale === 'en' ? WORDS_EN : WORDS_KO;
    const candidates = words.filter((w) => w.length === wordLength);
    const word = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : words[0];
    setTargetWord(word);
    const pool: string[] = [];
    for (const c of word) pool.push(c);
    const distractors = locale === 'en' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '가나다라마바사아자차카타파하';
    while (pool.length < wordLength + distractCount) {
      const d = distractors[Math.floor(Math.random() * distractors.length)];
      if (!pool.includes(d)) pool.push(d);
    }
    setLetters(pool.sort(() => Math.random() - 0.5));
    setFoundCount(0);
    setPhase('memorize');
    setTimeLeft(timeLimit);
    /* eslint-enable react-hooks/set-state-in-effect */

    const memorizeTimer = setTimeout(() => {
      setPhase('find');
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
    }, 1500);

    return () => {
      clearTimeout(memorizeTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [wordLength, distractCount, timeLimit, locale]);

  const handlePick = useCallback((char: string) => {
    if (phase !== 'find') return;
    if (targetWord.includes(char)) {
      setFoundCount((prev) => {
        const next = prev + 1;
        if (next >= targetWord.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          setTimeout(() => onResultRef.current(true), 500);
        }
        return next;
      });
    }
  }, [phase, targetWord]);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {phase === 'memorize' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">{locale === 'en' ? 'Memorize this word!' : '이 단어를 기억하세요!'}</p>
          <motion.div className="text-3xl font-bold text-amber-300 font-mono tracking-widest" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
            {targetWord.split('').map((c, i) => <span key={i}>{c}</span>)}
          </motion.div>
        </div>
      )}
      {phase === 'find' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${timePct}%` }} />
          </div>
          <p className="text-xs text-stone-500 mb-3">{locale === 'en' ? 'Find the letters!' : '글자를 찾으세요!'}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map((char, i) => (
              <button
                key={i}
                onClick={() => handlePick(char)}
                className="w-10 h-10 rounded-lg text-lg font-bold font-mono transition-all active:scale-90 bg-stone-800 text-stone-300 border-stone-600 hover:bg-stone-700 border"
              >
                {char}
              </button>
            ))}
          </div>
          <p className="text-xs text-amber-400 mt-2">{foundCount}/{targetWord.length}</p>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${foundCount >= targetWord.length ? 'text-emerald-400' : 'text-red-400'}`}>
            {foundCount >= targetWord.length
              ? (locale === 'en' ? '✅ Found!' : '✅ 찾았다!')
              : (locale === 'en' ? `❌ Time up! It was ${targetWord}` : `❌ 시간 초과! 정답: ${targetWord}`)}
          </p>
        </div>
      )}
    </div>
  );
}
