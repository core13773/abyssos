'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  cardCount: number;    // 3~5 cards
  shuffleSpeed: number; // seconds for shuffle animation
  showHint: boolean;    // guardian: Inquisitor's Lantern
  removeTrap: boolean;  // guardian: Cerberus's Collar
  onResult: (correct: boolean) => void;
}

export default function CardMatch({ cardCount, shuffleSpeed, showHint, removeTrap, onResult }: Props) {
  const actualCount = removeTrap ? Math.max(2, cardCount - 1) : cardCount;
  const [phase, setPhase] = useState<'reveal' | 'shuffle' | 'pick' | 'done'>('reveal');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [positions, setPositions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const shuffledRef = useRef(false);

  // Initialize correct card position
  useEffect(() => {
    setCorrectIdx(Math.floor(Math.random() * actualCount));
    setPositions(Array.from({ length: actualCount }, (_, i) => i));
    setFlipped(new Set(Array.from({ length: actualCount }, (_, i) => i))); // all revealed
    setPhase('reveal');
    shuffledRef.current = false;
  }, [actualCount]);

  // Reveal phase: show all cards for 1.5s, then shuffle
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => {
      setFlipped(new Set()); // hide all
      setPhase('shuffle');
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Shuffle phase: animate positions changing
  useEffect(() => {
    if (phase !== 'shuffle' || shuffledRef.current) return;
    shuffledRef.current = true;

    const shuffleCount = 8;
    let count = 0;
    const interval = setInterval(() => {
      setPositions(prev => {
        const next = [...prev];
        // Fisher-Yates shuffle
        for (let i = next.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [next[i], next[j]] = [next[j], next[i]];
        }
        return next;
      });
      count++;
      if (count >= shuffleCount) {
        clearInterval(interval);
        setTimeout(() => setPhase('pick'), 300);
      }
    }, shuffleSpeed * 1000);

    return () => clearInterval(interval);
  }, [phase, shuffleSpeed]);

  const handlePick = useCallback((idx: number) => {
    if (phase !== 'pick') return;
    setSelected(idx);
    setFlipped(new Set(Array.from({ length: actualCount }, (_, i) => i))); // reveal all
    setPhase('done');
    const correct = positions[idx] === correctIdx;
    setTimeout(() => onResult(correct), 800);
  }, [phase, positions, correctIdx, actualCount, onResult]);

  const cardWidth = actualCount >= 5 ? 52 : actualCount >= 4 ? 60 : 70;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase === 'reveal' && (
        <p className="text-xs text-amber-400 animate-pulse">
          Remember the key card!
        </p>
      )}
      {phase === 'shuffle' && (
        <p className="text-xs text-amber-400">Shuffling...</p>
      )}
      {phase === 'pick' && (
        <p className="text-xs text-amber-400 font-bold">Pick the correct card!</p>
      )}
      {phase === 'done' && selected !== null && (
        <p className={`text-sm font-bold ${positions[selected] === correctIdx ? 'text-emerald-400' : 'text-red-400'}`}>
          {positions[selected] === correctIdx ? '✅ Correct!' : '❌ Wrong!'}
        </p>
      )}

      <div className="flex gap-2 justify-center items-center" style={{ minHeight: '120px' }}>
        {Array.from({ length: actualCount }, (_, displayIdx) => {
          // The card at display position 'displayIdx' has original index 'positions[displayIdx]'
          const isCorrect = positions[displayIdx] === correctIdx;
          const isFlipped = flipped.has(displayIdx);
          const isSelected = selected === displayIdx;

          return (
            <motion.div
              key={displayIdx}
              className={`rounded-xl border-2 cursor-pointer flex items-center justify-center
                ${isSelected ? (isCorrect ? 'border-emerald-400 shadow-lg shadow-emerald-400/30' : 'border-red-400') : 'border-stone-600'}
                ${phase === 'pick' ? 'hover:border-amber-400 active:scale-95' : ''}
              `}
              style={{ width: cardWidth, height: cardWidth * 1.3 }}
              animate={{
                scale: isSelected ? 1.05 : 1,
                rotate: isSelected && !isCorrect ? [0, -5, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handlePick(displayIdx)}
              layout
            >
              {isFlipped ? (
                <div className={`w-full h-full rounded-xl flex items-center justify-center text-3xl ${
                  isCorrect ? 'bg-amber-900/30' : 'bg-stone-800/50'
                }`}>
                  {isCorrect ? (
                    <span className={showHint && phase === 'reveal' ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}>
                      👑
                    </span>
                  ) : (
                    <span>💀</span>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-xl bg-purple-900/40 flex items-center justify-center text-2xl">
                  ❓
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
