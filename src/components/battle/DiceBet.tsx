'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  requiredWins: number;  // how many correct predictions needed
  totalRounds: number;   // total betting rounds
  onResult: (success: boolean) => void;
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export default function DiceBet({ requiredWins, totalRounds, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'betting' | 'reveal' | 'done'>('ready');
  const [currentDie, setCurrentDie] = useState(1);
  const [nextDie, setNextDie] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [bet, setBet] = useState<'higher' | 'lower' | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const winsRef = useRef(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const startGame = useCallback(() => {
    const first = rollD6();
    setCurrentDie(first);
    setNextDie(null);
    setRound(1);
    setWins(0);
    winsRef.current = 0;
    setBet(null);
    setWon(null);
    setPhase('betting');
  }, []);

  const handleBet = useCallback((choice: 'higher' | 'lower') => {
    if (phase !== 'betting') return;
    const next = rollD6();
    setBet(choice);
    setNextDie(next);
    setPhase('reveal');

    const isWin = (choice === 'higher' && next > currentDie) || (choice === 'lower' && next < currentDie) || (next === currentDie && Math.random() > 0.5);
    setWon(isWin);

    if (isWin) {
      winsRef.current += 1;
      setWins(winsRef.current);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setPhase('done');
        setTimeout(() => onResultRef.current(winsRef.current >= requiredWins), 500);
      } else {
        setCurrentDie(next);
        setNextDie(null);
        setBet(null);
        setWon(null);
        setRound((r) => r + 1);
        setPhase('betting');
      }
    }, 1200);
  }, [phase, round, currentDie, totalRounds, requiredWins]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Predict the dice! Win ${requiredWins}/${totalRounds} rounds` : `주사위를 예측하라! ${totalRounds}판 중 ${requiredWins}승`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase !== 'ready' && phase !== 'done' && (
        <div className="w-full text-center">
          <div className="flex justify-between text-[10px] text-stone-500 mb-2">
            <span>{locale === 'en' ? 'Round' : '라운드'} {round}/{totalRounds}</span>
            <span>{locale === 'en' ? 'Wins' : '승리'} {wins}/{requiredWins}</span>
          </div>

          {/* Current die */}
          <motion.div
            key={`die-${currentDie}-${round}`}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-3 bg-stone-800 border-2 border-amber-600 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-300"
          >
            {currentDie}
          </motion.div>

          {phase === 'betting' && (
            <div className="flex gap-3 justify-center">
              <button onClick={() => handleBet('lower')} className="px-5 py-3 bg-blue-800 hover:bg-blue-700 text-blue-200 font-bold rounded-xl active:scale-95 transition-transform">
                ⬇ {locale === 'en' ? 'Lower' : '낮음'}
              </button>
              <button onClick={() => handleBet('higher')} className="px-5 py-3 bg-red-800 hover:bg-red-700 text-red-200 font-bold rounded-xl active:scale-95 transition-transform">
                ⬆ {locale === 'en' ? 'Higher' : '높음'}
              </button>
            </div>
          )}

          {phase === 'reveal' && nextDie !== null && (
            <div className="text-center">
              <p className="text-sm text-stone-400 mb-1">
                {locale === 'en' ? `You bet: ${bet === 'higher' ? 'Higher' : 'Lower'}` : `예측: ${bet === 'higher' ? '높음' : '낮음'}`}
              </p>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto mb-2 bg-stone-800 border-2 border-stone-500 rounded-xl flex items-center justify-center text-3xl font-bold text-stone-300">
                {nextDie}
              </motion.div>
              <p className={`text-lg font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
                {won ? (locale === 'en' ? '✅ Right!' : '✅ 정답!') : (locale === 'en' ? '❌ Wrong!' : '❌ 틀림!')}
              </p>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${wins >= requiredWins ? 'text-emerald-400' : 'text-red-400'}`}>
            {wins >= requiredWins
              ? (locale === 'en' ? `✅ ${wins}/${totalRounds} Won!` : `✅ ${wins}/${totalRounds}승!`)
              : (locale === 'en' ? `❌ ${wins}/${totalRounds} (need ${requiredWins})` : `❌ ${wins}/${totalRounds} (${requiredWins}승 필요)`)}
          </p>
        </div>
      )}
    </div>
  );
}
