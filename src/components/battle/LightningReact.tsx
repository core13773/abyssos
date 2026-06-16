'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  reactionTime: number;
  fakeChance: number;
  totalRounds: number;
  onResult: (success: boolean) => void;
}

export default function LightningReact({ reactionTime, fakeChance, totalRounds, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'waiting' | 'strike' | 'fake' | 'done'>('ready');
  const [, setRound] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [message, setMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  // nextRound 는 스스로를 다시 예약(재귀)하므로, ref로 우회해 "선언 전 참조"를 피한다.
  const nextRoundRef = useRef<((currentSuccess: number) => void) | null>(null);
  const nextRound = useCallback((currentSuccess: number) => {
    setPhase('waiting');
    setMessage('');
    const delay = 1000 + Math.random() * 2000;
    const isFake = Math.random() < fakeChance;
    timerRef.current = setTimeout(() => {
      if (isFake) {
        setPhase('fake');
        setMessage(locale === 'en' ? '⚡ FAKE!' : '⚡ 가짜!');
        timerRef.current = setTimeout(() => {
          setRound((r) => {
            const nr = r + 1;
            if (nr >= totalRounds) {
              setPhase('done');
              setTimeout(() => onResultRef.current(currentSuccess >= Math.ceil(totalRounds * 0.6)), 500);
            } else {
              nextRoundRef.current?.(currentSuccess);
            }
            return nr;
          });
        }, reactionTime);
      } else {
        setPhase('strike');
        setMessage(locale === 'en' ? '⚡ STRIKE!' : '⚡ 번개!');
        timerRef.current = setTimeout(() => {
          setRound((r) => {
            const nr = r + 1;
            if (nr >= totalRounds) {
              setPhase('done');
              setTimeout(() => onResultRef.current(currentSuccess >= Math.ceil(totalRounds * 0.6)), 500);
            } else {
              nextRoundRef.current?.(currentSuccess);
            }
            return nr;
          });
        }, reactionTime);
      }
    }, delay);
  }, [reactionTime, fakeChance, totalRounds, locale]);
  useEffect(() => { nextRoundRef.current = nextRound; }, [nextRound]);

  const startGame = useCallback(() => {
    setRound(0);
    setSuccessCount(0);
    nextRound(0);
  }, [nextRound]);

  const handleReact = useCallback(() => {
    if (phase === 'strike') {
      if (timerRef.current) clearTimeout(timerRef.current);
      const newSuccess = successCount + 1;
      setSuccessCount(newSuccess);
      setMessage(locale === 'en' ? '✅ Got it!' : '✅ 반응했다!');
      setRound((r) => {
        const nr = r + 1;
        if (nr >= totalRounds) {
          setPhase('done');
          setTimeout(() => onResultRef.current(newSuccess >= Math.ceil(totalRounds * 0.6)), 500);
        } else {
          setTimeout(() => nextRound(newSuccess), 300);
        }
        return nr;
      });
    } else if (phase === 'waiting') {
      setMessage(locale === 'en' ? '❌ Too early!' : '❌ 너무 일찍!');
    } else if (phase === 'fake') {
      setMessage(locale === 'en' ? '❌ It was fake!' : '❌ 가짜였다!');
    }
  }, [phase, totalRounds, locale, successCount, nextRound]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `React to ${totalRounds} lightning bolts!` : `${totalRounds}개의 번개에 반응하라!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-yellow-200 font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}
      {(phase === 'waiting' || phase === 'strike' || phase === 'fake') && (
        <div className="w-full text-center">
          <div className="text-4xl mb-2">
            {phase === 'waiting' && <span className="animate-pulse">⛈️</span>}
            {phase === 'strike' && <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1.5 }} className="text-yellow-400">⚡</motion.span>}
            {phase === 'fake' && <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1.2 }} className="text-stone-500">💨</motion.span>}
          </div>
          <p className="text-lg font-bold text-amber-400 mb-2">{message}</p>
          <p className="text-xs text-stone-500 mb-3">{successCount} / {Math.ceil(totalRounds * 0.6)} {locale === 'en' ? 'needed' : '필요'}</p>
          <button onClick={handleReact} className="w-24 h-24 rounded-full bg-yellow-800 hover:bg-yellow-700 active:bg-yellow-600 text-3xl font-bold border-4 border-yellow-500 active:scale-90 transition-transform">
            ⚡
          </button>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${successCount >= Math.ceil(totalRounds * 0.6) ? 'text-emerald-400' : 'text-red-400'}`}>
            {successCount >= Math.ceil(totalRounds * 0.6)
              ? (locale === 'en' ? `✅ ${successCount} hits!` : `✅ ${successCount}회 반응!`)
              : (locale === 'en' ? `❌ Only ${successCount} hits` : `❌ ${successCount}회뿐`)}
          </p>
        </div>
      )}
    </div>
  );
}
