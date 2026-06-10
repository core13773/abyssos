'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  speed: number;        // falling speed (lower = faster)
  targetZone: number;   // catch zone width as percentage (30-15)
  onResult: (success: boolean) => void;
}

export default function ReflexCatch({ speed, targetZone, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'falling' | 'done'>('ready');
  const [objY, setObjY] = useState(0);
  const [objX] = useState(() => 10 + Math.random() * 80); // random horizontal
  const [caught, setCaught] = useState(false);
  const animRef = useRef(0);
  const yRef = useRef(0);
  const targetBottom = 85; // where the catch zone is
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const startGame = useCallback(() => {
    setPhase('falling');
    yRef.current = 0;
    setObjY(0);

    const pxPerMs = 100 / (speed * 1000); // % per ms
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const y = pxPerMs * elapsed;
      yRef.current = y;
      setObjY(y);

      if (y >= 98) {
        cancelAnimationFrame(animRef.current);
        setPhase('done');
        setTimeout(() => onResultRef.current(false), 400);
        return;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, [speed]);

  const handleCatch = useCallback(() => {
    if (phase !== 'falling') return;
    cancelAnimationFrame(animRef.current);

    const currentY = yRef.current;
    const zoneStart = targetBottom - targetZone;
    const zoneEnd = targetBottom + targetZone;
    const isCaught = currentY >= zoneStart && currentY <= zoneEnd;

    setCaught(isCaught);
    setPhase('done');
    setTimeout(() => onResultRef.current(isCaught), 500);
  }, [phase, targetBottom, targetZone]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-2 select-none w-full"
      onClick={phase === 'falling' ? handleCatch : undefined}
    >
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? 'Catch the falling soul!' : '떨어지는 영혼을 잡아라!'}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); startGame(); }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
          >
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'falling' && (
        <div className="w-full">
          {/* Game area */}
          <div className="relative w-full h-48 bg-stone-900/80 rounded-xl border border-stone-700 overflow-hidden">
            {/* Falling object */}
            <motion.div
              className="absolute w-5 h-5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
              style={{ left: `${objX}%`, top: `${objY}%`, transform: 'translate(-50%, -50%)' }}
            />
            {/* Catch zone */}
            <div
              className="absolute left-0 right-0 bg-emerald-600/30 border-t-2 border-b-2 border-emerald-400/50"
              style={{
                top: `${targetBottom - targetZone}%`,
                height: `${targetZone * 2}%`,
              }}
            />
            <div className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-stone-500">
              👆 {locale === 'en' ? 'TAP TO CATCH!' : '탭해서 잡아라!'}
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${caught ? 'text-emerald-400' : 'text-red-400'}`}>
            {caught
              ? (locale === 'en' ? '✅ Caught!' : '✅ 잡았다!')
              : (locale === 'en' ? '❌ Missed!' : '❌ 놓쳤다!')}
          </p>
        </div>
      )}
    </div>
  );
}
