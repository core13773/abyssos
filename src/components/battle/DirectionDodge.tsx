'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  requiredDodges: number;  // successful dodges needed
  totalAttacks: number;     // total attacks incoming
  speed: number;            // ms between attacks
  onResult: (success: boolean) => void;
}

const DIRECTIONS = [
  { key: 'up',    icon: '⬆', label: 'UP',    x: 50, y: 10 },
  { key: 'down',  icon: '⬇', label: 'DOWN',  x: 50, y: 90 },
  { key: 'left',  icon: '⬅', label: 'LEFT',  x: 10, y: 50 },
  { key: 'right', icon: '➡', label: 'RIGHT', x: 90, y: 50 },
];

export default function DirectionDodge({ requiredDodges, totalAttacks, speed, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready');
  const [attackDir, setAttackDir] = useState<string | null>(null);
  const [attacksLeft, setAttacksLeft] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [lastResult, setLastResult] = useState<'hit' | 'miss' | null>(null);
  const dodgesRef = useRef(0);
  const attacksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const startGame = useCallback(() => {
    setPhase('active');
    setDodges(0); dodgesRef.current = 0;
    setAttacksLeft(totalAttacks); attacksRef.current = 0;

    let count = 0;
    timerRef.current = setInterval(() => {
      if (count >= totalAttacks) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(dodgesRef.current >= requiredDodges), 500);
        return;
      }
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      setAttackDir(dir.key);
      setAttacksLeft(totalAttacks - count - 1);
      count++;
      attacksRef.current = count;

      // Auto-miss after 600ms
      setTimeout(() => {
        setAttackDir((current) => {
          if (current === dir.key) {
            setLastResult('miss');
            return null;
          }
          return current;
        });
      }, 600);
    }, speed);
  }, [totalAttacks, speed, requiredDodges]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleDodge = useCallback((dir: string) => {
    if (phase !== 'active' || !attackDir) return;
    if (dir === attackDir) {
      dodgesRef.current += 1;
      setDodges(dodgesRef.current);
      setAttackDir(null);
      setLastResult('hit');
      if (dodgesRef.current >= requiredDodges) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(true), 400);
      }
    }
  }, [phase, attackDir, requiredDodges]);

  const arrowFromDir = attackDir ? DIRECTIONS.find((d) => d.key === attackDir) : null;

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Dodge ${requiredDodges}/${totalAttacks} attacks!` : `${totalAttacks}회 공격 중 ${requiredDodges}회 회피!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-sky-800 hover:bg-sky-700 text-sky-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-sky-600/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full text-center">
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span>{dodges}/{requiredDodges} {locale === 'en' ? 'Dodged' : '회피'}</span>
            <span>{attacksLeft} {locale === 'en' ? 'Left' : '남음'}</span>
          </div>

          {/* Attack zone */}
          <div className="relative w-full h-40 bg-stone-900/60 rounded-xl border border-stone-700 mb-3 flex items-center justify-center overflow-hidden">
            <AnimatePresence>
              {arrowFromDir && (
                <motion.div
                  key={arrowFromDir.key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute text-4xl"
                  style={{ left: `${arrowFromDir.x}%`, top: `${arrowFromDir.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {arrowFromDir.key === 'up' ? '💀' : arrowFromDir.key === 'down' ? '💀' : arrowFromDir.key === 'left' ? '💀' : '💀'}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: attackDir ? 360 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl opacity-30"
              >
                ⚔
              </motion.div>
            </div>
            {lastResult && (
              <motion.div
                key={lastResult}
                initial={{ scale: 2, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <span className={`text-3xl font-bold ${lastResult === 'hit' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {lastResult === 'hit' ? '✅' : '💥'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Dodge buttons */}
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            <div />
            <button onClick={() => handleDodge('up')} className="h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-sky-900 border border-stone-600 active:border-sky-500 text-xl transition-colors">
              ⬆
            </button>
            <div />
            <button onClick={() => handleDodge('left')} className="h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-sky-900 border border-stone-600 active:border-sky-500 text-xl transition-colors">
              ⬅
            </button>
            <div className="h-12 rounded-xl bg-stone-900/50 flex items-center justify-center text-xs text-stone-600">
              {locale === 'en' ? 'DODGE' : '회피'}
            </div>
            <button onClick={() => handleDodge('right')} className="h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-sky-900 border border-stone-600 active:border-sky-500 text-xl transition-colors">
              ➡
            </button>
            <div />
            <button onClick={() => handleDodge('down')} className="h-12 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-sky-900 border border-stone-600 active:border-sky-500 text-xl transition-colors">
              ⬇
            </button>
            <div />
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${dodges >= requiredDodges ? 'text-emerald-400' : 'text-red-400'}`}>
            {dodges >= requiredDodges
              ? (locale === 'en' ? `✅ Dodged ${dodges}!` : `✅ ${dodges}회 회피!`)
              : (locale === 'en' ? `❌ Only ${dodges}/${requiredDodges}` : `❌ ${dodges}/${requiredDodges}회`)}
          </p>
        </div>
      )}
    </div>
  );
}
