'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

const WORD_POOL_EN = ['HELLFIRE', 'PURGATORY', 'PARADISE', 'DANTE', 'VIRGIL', 'BEATRICE', 'ABYSSOS', 'COCYTUS', 'STYX', 'LETHE'];
const WORD_POOL_KO = ['지옥불', '연옥', '천국', '단테', '베르길리우스', '베아트리체', '코퀴토스', '스틱스', '레테', '심연'];

interface Props {
  wordLength: 'short' | 'medium' | 'long';  // affects time limit
  onResult: (success: boolean) => void;
}

export default function SpeedTyping({ wordLength, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'typing' | 'done'>('ready');
  const [targetWord, setTargetWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const pool = locale === 'en' ? WORD_POOL_EN : WORD_POOL_KO;
  const timeLimit = wordLength === 'long' ? 6 : wordLength === 'medium' ? 8 : 10;

  const startGame = useCallback(() => {
    const word = pool[Math.floor(Math.random() * pool.length)];
    setTargetWord(word);
    setUserInput('');
    setPhase('typing');
    setStartTime(Date.now());
    setTimeLeft(timeLimit);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setPhase('done');
        setTimeout(() => onResultRef.current(false), 500);
      }
    }, 100);
  }, [pool, timeLimit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (val.toUpperCase() === targetWord.toUpperCase()) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('done');
      setTimeout(() => onResultRef.current(true), 400);
    }
  }, [targetWord]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'Type the word before time runs out!' : '제한시간 내에 단어를 입력하세요!'}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
          >
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'typing' && (
        <div className="w-full text-center">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
              style={{ width: `${timePct}%`, transition: 'width 0.1s linear' }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mb-1">{timeLeft.toFixed(1)}s</p>
          <p className="text-2xl font-bold font-mono text-amber-400 mb-3 tracking-widest">{targetWord}</p>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            className="w-full text-center text-lg font-bold font-mono bg-stone-800 border-2 border-amber-600/50 rounded-xl py-2 text-amber-200 outline-none focus:border-amber-400 tracking-wider"
            autoFocus
            placeholder={locale === 'en' ? 'Type here...' : '입력하세요...'}
          />
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${userInput.toUpperCase() === targetWord.toUpperCase() ? 'text-emerald-400' : 'text-red-400'}`}>
            {userInput.toUpperCase() === targetWord.toUpperCase()
              ? (locale === 'en' ? '✅ Typed!' : '✅ 완료!')
              : (locale === 'en' ? `❌ Failed! Word: ${targetWord}` : `❌ 실패! 단어: ${targetWord}`)}
          </p>
        </div>
      )}
    </div>
  );
}
