'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  digits: number;       // 3-6 digit number to memorize
  memorizeTime: number;  // ms to show the number
  onResult: (success: boolean) => void;
}

function generateNumber(digits: number): string {
  let result = '';
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export default function NumberMemory({ digits, memorizeTime, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'memorize' | 'input' | 'done'>('memorize');
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [revealed, setRevealed] = useState(true);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const num = generateNumber(digits);
    setNumber(num);
    setPhase('memorize');
    setRevealed(true);
    setUserInput('');

    const hideTimer = setTimeout(() => {
      setRevealed(false);
      setPhase('input');
    }, memorizeTime);

    return () => clearTimeout(hideTimer);
  }, [digits, memorizeTime]);

  const handleSubmit = useCallback(() => {
    if (phase !== 'input') return;
    setPhase('done');
    const correct = userInput === number;
    setTimeout(() => onResultRef.current(correct), 500);
  }, [phase, userInput, number]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  const displayDigits = revealed ? number.split('') : number.split('').map(() => '?');

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase === 'memorize' && (
        <div className="text-center">
          <p className="text-xs text-stone-400 mb-1">
            {locale === 'en' ? 'Memorize this number!' : '숫자를 기억하세요!'}
          </p>
          <motion.div
            className="flex gap-1 justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {displayDigits.map((d, i) => (
              <span key={i} className="w-8 h-10 bg-amber-900/40 border border-amber-600/50 rounded-lg flex items-center justify-center text-xl font-bold font-mono text-amber-300">
                {d}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {phase === 'input' && (
        <div className="w-full text-center">
          <div className="flex gap-1 justify-center mb-3">
            {displayDigits.map((d, i) => (
              <span key={i} className="w-8 h-10 bg-stone-800 border border-stone-600 rounded-lg flex items-center justify-center text-xl font-bold font-mono text-stone-500">
                {d}
              </span>
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, '').slice(0, digits))}
            onKeyDown={handleKeyDown}
            className="w-40 text-center text-xl font-bold font-mono bg-stone-800 border-2 border-amber-600/50 rounded-xl py-2 text-amber-200 outline-none focus:border-amber-400 tracking-widest"
            autoFocus
            maxLength={digits}
            placeholder={Array(digits).fill('•').join('')}
          />
          <button
            onClick={handleSubmit}
            disabled={userInput.length < digits}
            className="block mx-auto mt-2 px-6 py-2 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
          >
            {locale === 'en' ? 'Submit' : '확인'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${userInput === number ? 'text-emerald-400' : 'text-red-400'}`}>
            {userInput === number
              ? (locale === 'en' ? '✅ Recalled!' : '✅ 기억했다!')
              : (locale === 'en' ? `❌ Wrong! It was ${number}` : `❌ 실패! 정답: ${number}`)}
          </p>
        </div>
      )}
    </div>
  );
}
