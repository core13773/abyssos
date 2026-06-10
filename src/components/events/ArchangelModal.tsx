'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import ColorSequence from '@/components/battle/ColorSequence';
import PatternMemory from '@/components/battle/PatternMemory';
import RapidTap from '@/components/battle/RapidTap';
import RhythmTap from '@/components/battle/RhythmTap';

export default function ArchangelModal() {
  const phase = useGameStore((s) => s.phase);
  const archangel = useGameStore((s) => s.activeArchangel);
  const player = useGameStore((s) => s.player);
  const setBattleRoll = useGameStore((s) => s.setBattleRoll);
  const resolveParadisoArchangel = useGameStore((s) => s.resolveParadisoArchangel);
  const locale = useLocale((s) => s.locale);

  const [result, setResult] = useState<boolean | null>(null);
  const [resolved, setResolved] = useState(false);

  const resolveWithResult = useCallback((success: boolean, d6val?: number) => {
    setResult(success); setResolved(true);
    setBattleRoll(d6val ?? (success ? 6 : 2));
  }, [setBattleRoll]);

  if (phase !== 'paradiso_archangel' || !archangel) return null;

  const name = locale === 'en' ? archangel.nameEn : archangel.name;
  const title = locale === 'en' ? archangel.titleEn : archangel.title;
  const trialDesc = locale === 'en' ? archangel.trialDescEn : archangel.trialDesc;
  const trialType = archangel.trialType;

  const renderTrial = () => {
    switch (trialType) {
      case 'quiz':
        // Archangel-1 Gabriel, Archangel-2 Raphael, Archangel-7 Cassiel: Quiz-style memory test
        return <PatternMemory patternLength={4} memorizeTime={2200} onResult={(success) => resolveWithResult(success, success ? 6 : 2)} />;
      case 'narrative_choice':
        // Narrative choice: pattern memory representing the story-based choice
        return <PatternMemory patternLength={3} memorizeTime={2000} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      case 'timing_multi':
        // Archangel-3 Uriel, Archangel-4 Michael, Archangel-8 Sandalphon: Rhythm challenge
        return (
          <RhythmTap
            beatCount={5}
            bpm={140}
            tolerance={180}
            onResult={(success: boolean) => resolveWithResult(success, success ? 6 : 3)}
          />
        );
      case 'rapid_sequence':
        // Archangel-5 Samael: Rapid tap challenge
        return <RapidTap targetTaps={25} timeLimit={8} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      case 'balance':
        // Archangel-6 Zadkiel: Risk-reward choice
        return resolved ? null : (
          <div className="flex flex-col gap-2">
            <button onClick={() => resolveWithResult(true, 5)} className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-sm active:scale-95 transition-transform">
              🛡 {locale === 'en' ? 'Safe (+10 Grace guaranteed)' : '안전 (+10 은총 확정)'}
            </button>
            <button onClick={() => resolveWithResult(Math.random() < 0.5, 6)} className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-amber-200 font-bold rounded-xl text-sm active:scale-95 transition-transform">
              ⚖ {locale === 'en' ? 'Fair (50% +20 Grace)' : '공정 (50% +20 은총)'}
            </button>
          </div>
        );
      case 'final_ascension':
        // Archangel-9 Metatron: Triple challenge — fast taps + high target
        return <RapidTap targetTaps={35} timeLimit={7} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      case 'song_match':
        // Archangel fallback for song_match: pattern-based matching
        return <PatternMemory patternLength={5} memorizeTime={1800} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      case 'meditation':
        // Meditation: color sequence with extra time
        return <ColorSequence sequenceLength={3} showTime={900} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      case 'memory_path':
        // Memory path: pattern memory with 5 items
        return <PatternMemory patternLength={5} memorizeTime={2500} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
      default:
        return <ColorSequence sequenceLength={3} showTime={700} onResult={(success) => resolveWithResult(success, success ? 6 : 3)} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}>
          <div className="flex gap-3 items-start mb-3">
            <div className="shrink-0 w-[80px] h-[80px] rounded-full bg-gradient-to-b from-amber-400/30 to-amber-600/20 border border-amber-500/40 flex items-center justify-center">
              <span className="text-4xl">👼</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{t('paradiso.archangelAppeared', locale)}</span>
              <h2 className="text-base font-bold text-amber-300 font-serif truncate">{name}</h2>
              <p className="text-[11px] text-stone-400 italic">{title}</p>
              <span className="text-[9px] bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded-full mt-1 inline-block">{t('paradiso.reward', locale)}: +{archangel.graceBlessing} Grace</span>
            </div>
          </div>
          <div className="bg-stone-800/70 rounded-lg p-2.5 mb-3 border border-stone-700">
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">{t('paradiso.trial', locale)}</p>
            <p className="text-[11px] text-stone-300 leading-relaxed">{trialDesc}</p>
          </div>
          <div className="mb-3">{renderTrial()}</div>
          {resolved && result !== null && (
            <div className="text-center">
              <p className={`text-xl font-bold mb-1 ${result ? 'text-emerald-400' : 'text-amber-400'}`}>{result ? (locale === 'en' ? '✅ PASSED!' : '✅ 통과!') : (locale === 'en' ? '💫 Not yet...' : '💫 아직...')}</p>
              <Button variant="primary" size="lg" onClick={resolveParadisoArchangel} className="w-full min-h-[48px] bg-amber-600 hover:bg-amber-500">{locale === 'en' ? 'Ascend ▶' : '승천 ▶'}</Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
