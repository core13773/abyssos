'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  digits: number;
  memorizeTime: number;
  onResult: (success: boolean) => void;
}

function generateNumber(digits: number): string {
  let result = '';
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

const KEYPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -2]; // -1 = empty, -2 = delete

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

  const handleDigit = useCallback((d: number) => {
    if (phase !== 'input') return;
    setUserInput((prev) => {
      if (prev.length >= digits) return prev;
      return prev + d.toString();
    });
  }, [phase, digits]);

  const handleDelete = useCallback(() => {
    if (phase !== 'input') return;
    setUserInput((prev) => prev.slice(0, -1));
  }, [phase]);

  // Auto-submit when all digits entered
  useEffect(() => {
    if (phase === 'input' && userInput.length === digits) {
      setPhase('done');
      const correct = userInput === number;
      setTimeout(() => onResultRef.current(correct), 500);
    }
  }, [phase, userInput, digits, number]);

  const displayDigits = revealed
    ? number.split('')
    : number.split('').map(() => '?');

  const inputDisplay = userInput.padEnd(digits, '•').split('');

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
          {/* Input display boxes */}
          <div className="flex gap-1 justify-center mb-3">
            {inputDisplay.map((d, i) => (
              <span
                key={i}
                className={`w-8 h-10 border rounded-lg flex items-center justify-center text-xl font-bold font-mono transition-colors ${
                  i < userInput.length
                    ? 'bg-amber-900/30 border-amber-500 text-amber-300'
                    : 'bg-stone-800 border-stone-600 text-stone-600'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto">
            {KEYPAD.map((key) => {
              if (key === -1) {
                return <div key="empty" />;
              }
              if (key === -2) {
                return (
                  <button
                    key="del"
                    onClick={handleDelete}
                    className="h-11 rounded-xl bg-stone-700 hover:bg-stone-600 active:bg-stone-500 text-stone-300 font-bold text-sm transition-colors"
                  >
                    ⌫
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  onClick={() => handleDigit(key)}
                  disabled={userInput.length >= digits}
                  className="h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-amber-800 disabled:opacity-40 text-amber-200 font-bold text-lg transition-colors border border-stone-700 hover:border-amber-700/50"
                >
                  {key}
                </button>
              );
            })}
          </div>
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
