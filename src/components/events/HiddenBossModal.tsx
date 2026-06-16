'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';
import ColorSequence from '@/components/battle/ColorSequence';
import RapidTap from '@/components/battle/RapidTap';
import TapRunner from '@/components/battle/TapRunner';
import { unlockAchievement } from '@/lib/data/achievements';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HiddenBossModal({ open, onClose }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'intro' | 'phase1' | 'phase2' | 'phase3' | 'victory' | 'defeat'>('intro');
  const [phaseResults, setPhaseResults] = useState([false, false, false]);

  const reset = useCallback(() => {
    setPhase('intro');
    setPhaseResults([false, false, false]);
  }, []);

  const handlePhase1 = (success: boolean) => {
    const next = [...phaseResults];
    next[0] = success;
    setPhaseResults(next);
    if (!success) {
      setPhase('defeat');
    } else {
      setPhase('phase2');
    }
  };

  const handlePhase2 = (success: boolean) => {
    const next = [...phaseResults];
    next[1] = success;
    setPhaseResults(next);
    if (!success) {
      setPhase('defeat');
    } else {
      setPhase('phase3');
    }
  };

  const handlePhase3 = (success: boolean) => {
    const next = [...phaseResults];
    next[2] = success;
    setPhaseResults(next);
    if (!success) {
      setPhase('defeat');
    } else {
      setPhase('victory');
      unlockAchievement('hidden-boss');
      try {
        const raw = localStorage.getItem('abyssos_meta');
        const meta = raw ? JSON.parse(raw) : { soulStones: 0, upgrades: {} };
        meta.soulStones = (meta.soulStones || 0) + 10;
        localStorage.setItem('abyssos_meta', JSON.stringify(meta));
        window.dispatchEvent(new Event('storage'));
      } catch { /* ignore */ }
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-purple-700/50 rounded-2xl p-4 w-full max-w-xs"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {phase === 'intro' && (
            <div className="text-center">
              <p className="text-4xl mb-2">🌑</p>
              <h2 className="text-lg font-bold text-purple-300 font-serif mb-2">
                {locale === 'en' ? 'Corrupted Virgil' : '타락한 베르길리우스'}
              </h2>
              <p className="text-xs text-stone-400 mb-4">
                {locale === 'en'
                  ? 'The guide has fallen. Three trials await. Survive all to claim the abyssal reward.'
                  : '안내자가 타락했다. 세 가지 시험이 기다린다. 모두 통과하면 심연의 보상을 얻는다.'}
              </p>
              <div className="flex gap-2 justify-center text-[10px] text-stone-500 mb-4">
                <span>🎨 {locale === 'en' ? 'Memory' : '기억'}</span>
                <span>⚡ {locale === 'en' ? 'Speed' : '속도'}</span>
                <span>🎯 {locale === 'en' ? 'Timing' : '타이밍'}</span>
              </div>
              <Button variant="primary" size="lg" onClick={() => setPhase('phase1')} className="w-full bg-purple-800 hover:bg-purple-700">
                {locale === 'en' ? 'Challenge ▶' : '도전하기 ▶'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="w-full mt-2">
                {locale === 'en' ? 'Retreat' : '후퇴'}
              </Button>
            </div>
          )}

          {phase === 'phase1' && (
            <div>
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-purple-300">🎨 {locale === 'en' ? 'Phase 1: Memory' : '1단계: 기억'}</p>
                <div className="flex gap-1 justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="w-2 h-2 rounded-full bg-stone-700" />
                  <span className="w-2 h-2 rounded-full bg-stone-700" />
                </div>
              </div>
              <ColorSequence
                sequenceLength={5}
                showTime={1200}
                onResult={handlePhase1}
              />
            </div>
          )}

          {phase === 'phase2' && (
            <div>
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-purple-300">⚡ {locale === 'en' ? 'Phase 2: Speed' : '2단계: 속도'}</p>
                <div className="flex gap-1 justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="w-2 h-2 rounded-full bg-stone-700" />
                </div>
              </div>
              <RapidTap
                targetTaps={20}
                timeLimit={4}
                onResult={handlePhase2}
              />
            </div>
          )}

          {phase === 'phase3' && (
            <div>
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-purple-300">🎯 {locale === 'en' ? 'Phase 3: Timing' : '3단계: 타이밍'}</p>
                <div className="flex gap-1 justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
              </div>
              <TapRunner
                rounds={5}
                targetHits={3}
                sweepMs={1000}
                onResult={handlePhase3}
              />
            </div>
          )}

          {phase === 'victory' && (
            <div className="text-center">
              <p className="text-4xl mb-2">✨</p>
              <h2 className="text-lg font-bold text-emerald-400 font-serif mb-2">
                {locale === 'en' ? 'Abyss Conquered!' : '심연 정복!'}
              </h2>
              <p className="text-xs text-stone-400 mb-4">
                {locale === 'en'
                  ? 'Corrupted Virgil fades into light. You have claimed the abyssal reward: 10 Soul Stones!'
                  : '타락한 베르길리우스가 빛 속으로 사라진다. 심연의 보상을 얻었다: 영혼석 10개!'}
              </p>
              <Button variant="primary" size="lg" onClick={() => { reset(); onClose(); }} className="w-full">
                {locale === 'en' ? 'Continue' : '계속'}
              </Button>
            </div>
          )}

          {phase === 'defeat' && (
            <div className="text-center">
              <p className="text-4xl mb-2">💀</p>
              <h2 className="text-lg font-bold text-red-400 font-serif mb-2">
                {locale === 'en' ? 'The Abyss Claims You' : '심연이 당신을 집어삼킨다'}
              </h2>
              <p className="text-xs text-stone-400 mb-4">
                {locale === 'en'
                  ? 'The corruption was too strong. Gather more strength and try again.'
                  : '타락이 너무 강했다. 더 힘을 모아 다시 도전하라.'}
              </p>
              <Button variant="primary" size="lg" onClick={() => { reset(); setPhase('intro'); }} className="w-full bg-stone-700 hover:bg-stone-600">
                {locale === 'en' ? 'Try Again' : '다시 도전'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { reset(); onClose(); }} className="w-full mt-2">
                {locale === 'en' ? 'Retreat' : '후퇴'}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
