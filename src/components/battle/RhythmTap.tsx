'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  beatCount: number;   // number of beats in the pattern (3-6)
  bpm: number;         // beats per minute (80-160)
  tolerance: number;   // ms tolerance for "on beat" (150-300ms)
  onResult: (success: boolean, accuracy: number) => void;
}

export default function RhythmTap({ beatCount, bpm, tolerance, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [playerTapCount, setPlayerTapCount] = useState(0);
  const [results, setResults] = useState<('perfect' | 'good' | 'miss')[]>([]);
  const beatTimesRef = useRef<number[]>([]);
  const tapTimesRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const beatInterval = (60 / bpm) * 1000; // ms per beat

  const startGame = useCallback(() => {
    setPhase('playing');
    setCurrentBeat(0);
    setPlayerTapCount(0);
    setResults([]);
    beatTimesRef.current = [];
    tapTimesRef.current = [];

    // Schedule all beats
    let beat = 0;
    timerRef.current = setInterval(() => {
      beatTimesRef.current.push(Date.now());
      setCurrentBeat(beat);
      beat++;
      if (beat >= beatCount) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Wait for taps, then evaluate
        setTimeout(() => {
          setPhase('done');
          evaluateResults();
        }, tolerance * 2);
      }
    }, beatInterval);
  }, [beatCount, beatInterval, tolerance]);

  const evaluateResults = useCallback(() => {
    const playerTaps = tapTimesRef.current;
    const beats = beatTimesRef.current;
    const evalResults: ('perfect' | 'good' | 'miss')[] = [];

    for (let i = 0; i < beatCount; i++) {
      const beatTime = beats[i];
      // Find closest tap to this beat
      let bestDiff = Infinity;
      for (let j = 0; j < playerTaps.length; j++) {
        const diff = Math.abs(playerTaps[j] - beatTime);
        if (diff < bestDiff) bestDiff = diff;
      }

      if (bestDiff <= tolerance * 0.5) evalResults.push('perfect');
      else if (bestDiff <= tolerance) evalResults.push('good');
      else evalResults.push('miss');
    }

    setResults(evalResults);
    const perfectCount = evalResults.filter((r) => r === 'perfect').length;
    const goodCount = evalResults.filter((r) => r === 'good').length;
    const success = (perfectCount + Math.floor(goodCount * 0.7)) >= Math.ceil(beatCount * 0.6);
    const accuracy = Math.round(((perfectCount * 2 + goodCount) / (beatCount * 2)) * 100);
    setTimeout(() => onResultRef.current(success, accuracy), 600);
  }, [beatCount, tolerance]);

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return;
    tapTimesRef.current.push(Date.now());
    setPlayerTapCount((c) => c + 1);
  }, [phase]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalPerfect = results.filter((r) => r === 'perfect').length;
  const totalGood = results.filter((r) => r === 'good').length;

  return (
    <div className="flex flex-col items-center gap-3 select-none" onClick={handleTap}>
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Tap to the rhythm! (${beatCount} beats, ${bpm} BPM)` : `리듬에 맞춰 탭하세요! (${beatCount}박자, ${bpm} BPM)`}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); startGame(); }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
          >
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full text-center">
          <motion.div
            className="w-24 h-24 rounded-full bg-amber-600/20 border-4 border-amber-500 mx-auto flex items-center justify-center"
            animate={currentBeat >= 0 ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span className="text-2xl font-bold text-amber-300 font-mono">
              {Math.max(0, currentBeat + 1)}/{beatCount}
            </span>
          </motion.div>
          <p className="text-sm text-stone-400 mt-2">
            👆 {locale === 'en' ? 'TAP TO THE BEAT!' : '박자에 맞춰 탭!'}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {locale === 'en' ? `Taps: ${playerTapCount}` : `탭: ${playerTapCount}회`}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <div className="flex gap-1 justify-center mb-2">
            {results.map((r, i) => (
              <span key={i} className={`text-lg ${r === 'perfect' ? '' : r === 'good' ? 'opacity-60' : 'opacity-20'}`}>
                {r === 'perfect' ? '💛' : r === 'good' ? '💚' : '🖤'}
              </span>
            ))}
          </div>
          <p className={`text-lg font-bold ${totalPerfect + totalGood >= Math.ceil(beatCount * 0.6) ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPerfect + totalGood >= Math.ceil(beatCount * 0.6)
              ? (locale === 'en' ? `✅ In Rhythm! (${totalPerfect}P ${totalGood}G)` : `✅ 리듬 성공! (${totalPerfect}P ${totalGood}G)`)
              : (locale === 'en' ? `❌ Off Beat! (${totalPerfect}P ${totalGood}G)` : `❌ 리듬 실패! (${totalPerfect}P ${totalGood}G)`)}
          </p>
        </div>
      )}
    </div>
  );
}
