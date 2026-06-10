'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

interface Props {
  targetTaps: number;
  timeLimit: number;
  onResult: (success: boolean, count: number) => void;
}

export default function RapidTap({ targetTaps, timeLimit, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready');
  const [tapCount, setTapCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const tapRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const startGame = useCallback(() => {
    setPhase('active');
    tapRef.current = 0;
    setTapCount(0);
    setTimeLeft(timeLimit);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setPhase('done');
        onResultRef.current(tapRef.current >= targetTaps, tapRef.current);
      }
    }, 50);
  }, [timeLimit, targetTaps]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleTap = useCallback(() => {
    if (phase !== 'active') return;
    tapRef.current += 1;
    setTapCount(tapRef.current);
    if (tapRef.current >= targetTaps) {
      clearInterval(timerRef.current);
      setPhase('done');
      setTimeout(() => onResultRef.current(true, tapRef.current), 300);
    }
  }, [phase, targetTaps]);

  const pct = Math.min(100, (tapCount / targetTaps) * 100);
  const timePct = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none" onClick={handleTap}>
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-sm text-amber-400 font-bold mb-2">{t('rapidtap.prompt', locale, { n: targetTaps })}</p>
          <p className="text-xs text-stone-400 mb-1">{t('rapidtap.timeLimit', locale, { s: timeLimit })}</p>
          <button
            onClick={(e) => { e.stopPropagation(); startGame(); }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
          >
            {t('rapidtap.start', locale)}
          </button>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full text-center">
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full ${timePct > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
              style={{ width: `${timePct}%`, transition: 'width 0.05s linear' }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mb-1">{timeLeft.toFixed(1)}s</p>
          <div className="h-3 bg-stone-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${pct}%`, transition: 'width 0.05s linear' }}
            />
          </div>
          <p className="text-3xl font-bold text-amber-400 font-mono">{tapCount}<span className="text-stone-600 text-lg">/{targetTaps}</span></p>
          <p className="text-xs text-stone-500 mt-2 animate-pulse">{t('rapidtap.tapAnywhere', locale)}</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-2xl font-bold ${tapCount >= targetTaps ? 'text-emerald-400' : 'text-red-400'}`}>
            {tapCount >= targetTaps ? t('rapidtap.success', locale, { n: tapCount }) : t('rapidtap.fail', locale, { n: tapCount, target: targetTaps })}
          </p>
        </div>
      )}
    </div>
  );
}
