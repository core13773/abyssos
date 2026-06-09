'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

const COLORS = [
  { name: 'Red', emoji: '🔴', ring: 'ring-red-400', bg: 'bg-red-600 hover:bg-red-500 active:bg-red-400' },
  { name: 'Blue', emoji: '🔵', ring: 'ring-blue-400', bg: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-400' },
  { name: 'Green', emoji: '🟢', ring: 'ring-green-400', bg: 'bg-green-600 hover:bg-green-500 active:bg-green-400' },
  { name: 'Yellow', emoji: '🟡', ring: 'ring-yellow-400', bg: 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-400' },
];

interface Props {
  sequenceLength: number;
  showTime: number;  // ms per flash
  onResult: (success: boolean) => void;
  label?: string;
}

export default function ColorSequence({ sequenceLength, showTime, onResult, label }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'watching' | 'playing' | 'done'>('watching');
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  // Generate random sequence on mount
  useEffect(() => {
    const seq = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 4));
    setSequence(seq);

    // Play the sequence
    let i = 0;
    setPhase('watching');
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setActiveIdx(-1);
        setPhase('playing');
        setPlayerIdx(0);
        return;
      }
      setActiveIdx(seq[i]);
      setFlashing(true);
      setTimeout(() => setFlashing(false), showTime * 0.6);
      i++;
    }, showTime);

    return () => clearInterval(interval);
  }, [sequenceLength, showTime]);

  const handlePress = useCallback((colorIdx: number) => {
    if (phase !== 'playing') return;

    if (colorIdx === sequence[playerIdx]) {
      // Correct!
      const nextIdx = playerIdx + 1;
      if (nextIdx >= sequence.length) {
        setPhase('done');
        setPlayerIdx(nextIdx);
        setTimeout(() => onResultRef.current(true), 500);
      } else {
        setPlayerIdx(nextIdx);
      }
    } else {
      // Wrong!
      setPhase('done');
      setActiveIdx(colorIdx);
      setTimeout(() => onResultRef.current(false), 500);
    }
  }, [phase, playerIdx, sequence]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Progress dots */}
      <div className="flex gap-1.5">
        {sequence.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
            i < playerIdx ? 'bg-emerald-400' :
            i === playerIdx && phase === 'playing' ? 'bg-amber-400 animate-pulse' :
            phase === 'done' && playerIdx < sequence.length ? 'bg-red-400' :
            'bg-stone-700'
          }`} />
        ))}
      </div>

      {/* Label */}
      <p className="text-xs text-stone-400">
        {phase === 'watching' ? t('colorSeq.watch', locale) :
         phase === 'playing' ? t('colorSeq.play', locale, { n: playerIdx + 1, total: sequence.length }) :
         playerIdx >= sequence.length ? t('colorSeq.success', locale) : t('colorSeq.fail', locale)}
      </p>

      {/* Color buttons */}
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handlePress(i)}
            disabled={phase === 'done'}
            className={`w-16 h-16 rounded-2xl ${color.bg} transition-all active:scale-90 ${
              flashing && activeIdx === i ? 'ring-4 ring-white scale-110 brightness-150' : ''
            } ${phase === 'done' ? 'opacity-50' : ''}`}
          >
            <span className="text-2xl">{color.emoji}</span>
          </button>
        ))}
      </div>

      {label && <p className="text-[10px] text-stone-500">{label}</p>}
    </div>
  );
}
