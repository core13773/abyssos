'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

const WORDS_KO = [
  '구원', '심판', '영혼', '천사', '악마', '연옥', '천국', '지옥', '빛', '어둠',
  '사랑', '희망', '믿음', '용기', '지혜', '정의', '평화', '자비', '은총', '성물',
];
const WORDS_EN = [
  'SOUL', 'HELL', 'HEAVEN', 'ANGEL', 'DEVIL', 'LIGHT', 'DARK', 'GRACE', 'FAITH', 'HOPE',
  'LOVE', 'PEACE', 'TRUTH', 'WRATH', 'PRIDE', 'GREED', 'LUST', 'ENVY', 'SLOTH', 'GLUTTONY',
];

interface Props {
  timeLimit: number;
  onResult: (success: boolean, score: number) => void;
}

export default function WordScramble({ timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [targetWord, setTargetWord] = useState('');
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const generateWord = useCallback(() => {
    const words = locale === 'en' ? WORDS_EN : WORDS_KO;
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    const chars = word.split('').sort(() => Math.random() - 0.5);
    setScrambled(chars);
    setSelected([]);
  }, [locale]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setScore(0);
    setTimeLeft(timeLimit);
    generateWord();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          setTimeout(() => onResultRef.current(false, 0), 500);
        }
        return next;
      });
    }, 100);
  }, [timeLimit, generateWord]);

  const handleSelect = useCallback((idx: number) => {
    if (phase !== 'playing') return;
    if (selected.includes(idx)) return;
    const nextSelected = [...selected, idx];
    setSelected(nextSelected);
    const formed = nextSelected.map((i) => scrambled[i]).join('');
    if (formed === targetWord) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= 3) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true, newScore), 500);
      } else {
        generateWord();
      }
    } else if (nextSelected.length >= targetWord.length) {
      setSelected([]);
    }
  }, [phase, selected, scrambled, targetWord, score, generateWord]);

  const handleReset = useCallback(() => {
    setSelected([]);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'Unscramble 3 words!' : '단어 3개를 맞춰라!'}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-emerald-600/50">
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
            <span>{locale === 'en' ? `Words: ${score}/3` : `단어: ${score}/3`}</span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>

          <div className="text-center mb-3">
            <p className="text-xs text-stone-400 mb-1">{locale === 'en' ? 'Form the word:' : '단어를 완성하세요:'}</p>
            <div className="flex gap-1 justify-center min-h-[36px]">
              {targetWord.split('').map((_, i) => {
                const char = i < selected.length ? scrambled[selected[i]] : '_';
                return (
                  <motion.div
                    key={i}
                    className="w-8 h-9 rounded-lg bg-stone-800 border border-stone-600 flex items-center justify-center text-lg font-bold font-mono text-amber-300"
                    animate={i < selected.length ? { scale: [1, 1.1, 1] } : {}}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {scrambled.map((char, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected.includes(i)}
                className={`w-10 h-10 rounded-lg text-lg font-bold font-mono transition-all active:scale-90 border ${
                  selected.includes(i)
                    ? 'bg-stone-900 text-stone-700 border-stone-800 cursor-not-allowed'
                    : 'bg-stone-800 text-stone-300 border-stone-600 hover:bg-stone-700'
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-1.5 text-[10px] text-stone-500 hover:text-stone-300 transition-colors"
          >
            {locale === 'en' ? '↺ Reset selection' : '↺ 선택 초기화'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${score >= 3 ? 'text-emerald-400' : 'text-red-400'}`}>
            {score >= 3
              ? (locale === 'en' ? `✅ ${score} words!` : `✅ ${score}개 완성!`)
              : (locale === 'en' ? `❌ Only ${score} words` : `❌ ${score}개뿐`)}
          </p>
        </div>
      )}
    </div>
  );
}
