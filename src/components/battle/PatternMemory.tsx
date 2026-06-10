'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

const PATTERNS = ['⬆', '⬇', '⬅', '➡', '↗', '↘', '↙', '↖'];
const ITEMS = ['🌟', '🔥', '💎', '🌙', '⚡', '🌪', '❄️', '🩸'];

function generatePattern(length: number): string[] {
  const pool = length <= 4 ? PATTERNS : ITEMS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, length);
}

interface Props {
  patternLength: number;
  memorizeTime: number; // ms
  onResult: (success: boolean) => void;
  label?: string;
}

export default function PatternMemory(props: Props) {
  // Force remount when pattern parameters change so state resets naturally
  return <PatternMemoryInner key={`${props.patternLength}-${props.memorizeTime}`} {...props} />;
}

function PatternMemoryInner({ patternLength, memorizeTime, onResult, label }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'done'>('memorize');
  const [selected, setSelected] = useState<number | null>(null);
  const [pattern] = useState(() => generatePattern(patternLength));
  const [options] = useState(() => {
    const wrongOptions = Array.from({ length: 3 }, () => generatePattern(patternLength));
    return [pattern, ...wrongOptions].sort(() => Math.random() - 0.5);
  });
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Timer for memorize phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('recall'), memorizeTime);
    return () => clearTimeout(timer);
  }, [memorizeTime]);

  const handleSelect = useCallback((idx: number) => {
    if (phase !== 'recall') return;
    setSelected(idx);
    setPhase('done');
    const isCorrect = JSON.stringify(options[idx]) === JSON.stringify(pattern);
    setTimeout(() => onResultRef.current(isCorrect), 600);
  }, [phase, options, pattern]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Status */}
      <p className="text-xs text-stone-400 font-bold">
        {phase === 'memorize' ? t('pattern.memorize', locale) :
         phase === 'recall' ? t('pattern.recall', locale) :
         selected !== null && JSON.stringify(options[selected]) === JSON.stringify(pattern) ? t('pattern.correct', locale) : t('pattern.wrong', locale)}
      </p>

      {/* Pattern display */}
      {phase === 'memorize' && (
        <div className="bg-stone-800/80 rounded-xl p-4 flex gap-2 items-center justify-center animate-pulse">
          {pattern.map((item, i) => (
            <span key={i} className="text-3xl">{item}</span>
          ))}
        </div>
      )}

      {/* Recall: show options */}
      {phase === 'recall' && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="bg-stone-800/70 hover:bg-stone-700 border border-stone-600 rounded-xl p-2 flex gap-1 items-center justify-center active:scale-95 transition-all"
            >
              {opt.map((item, j) => (
                <span key={j} className="text-xl">{item}</span>
              ))}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {phase === 'done' && (
        <div className="text-center">
          <p className="text-[10px] text-stone-500">
            {t('pattern.answer', locale, { answer: pattern.join(' ') })}
          </p>
        </div>
      )}

      {label && <p className="text-[10px] text-stone-500">{label}</p>}
    </div>
  );
}
