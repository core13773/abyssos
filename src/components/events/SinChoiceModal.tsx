'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

const ELEMENT_EMOJI: Record<string, string> = {
  earth: '🪨', sight: '👁', smoke: '🌫', lightning: '⚡',
  crystal: '💎', wood: '🌳', purgefire: '🔥',
};

const CHALLENGE_LABELS: Record<string, { en: string; ko: string }> = {
  narrative_choice: { en: 'MORAL DILEMMA', ko: '도덕적 딜레마' },
  virtue_test: { en: 'VIRTUE TEST', ko: '덕목 시험' },
  memory: { en: 'MEMORY', ko: '기억' },
  sequence: { en: 'SEQUENCE', ko: '연속 동작' },
  meditation: { en: 'MEDITATION', ko: '명상' },
};

export default function SinChoiceModal() {
  const phase = useGameStore((s) => s.phase);
  const sin = useGameStore((s) => s.activeSinProjection);
  const player = useGameStore((s) => s.player);
  const resolveSinChoice = useGameStore((s) => s.resolveSinChoice);
  const skipPurgatorioBattle = useGameStore((s) => s.skipPurgatorioBattle);
  const locale = useLocale((s) => s.locale);

  if (phase !== 'purgatorio_battle' || !sin) return null;

  const name = locale === 'en' ? sin.nameEn : sin.name;
  const narrative = locale === 'en' ? sin.narrativeEn : sin.narrative;
  const challengeType = sin.challengeType || 'narrative_choice';
  const challengeLabel = locale === 'en'
    ? (CHALLENGE_LABELS[challengeType]?.en || 'CHOICE')
    : (CHALLENGE_LABELS[challengeType]?.ko || '선택');
  const icon = ELEMENT_EMOJI[sin.element] || '👤';
  const hasFeather = player.buffs.some((b) => b.id === 'angel_feather');

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-violet-500/40 rounded-2xl p-3 w-full max-w-xs overflow-y-auto max-h-[95vh]"
          initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">
                {challengeLabel}
              </span>
              <h2 className="text-base font-bold text-violet-200 font-serif">{name}</h2>
            </div>
          </div>

          {/* Narrative */}
          <div className="bg-violet-950/30 rounded-lg p-3 mb-3 border border-violet-800/40">
            <p className="text-sm text-stone-200 leading-relaxed italic font-serif">
              &ldquo;{narrative}&rdquo;
            </p>
          </div>

          {/* Choices */}
          <div className="flex flex-col gap-2 mb-2">
            {sin.choices.map((choice, i) => {
              const label = locale === 'en' ? choice.labelEn : choice.label;
              const desc = locale === 'en' ? choice.descEn : choice.desc;
              const isVirtuous = choice.outcome.virtue > 0;
              return (
                <button
                  key={i}
                  onClick={() => resolveSinChoice(i as 0 | 1)}
                  className={`w-full text-left p-3 rounded-xl border active:scale-[0.98] transition-all ${
                    isVirtuous
                      ? 'bg-emerald-950/30 border-emerald-700/50 hover:bg-emerald-900/40 hover:border-emerald-600/60'
                      : 'bg-red-950/20 border-red-800/40 hover:bg-red-900/30 hover:border-red-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-lg ${isVirtuous ? '' : ''}`}>
                      {isVirtuous ? '✨' : '⚠'}
                    </span>
                    <span className={`text-sm font-bold ${isVirtuous ? 'text-emerald-300' : 'text-red-300'}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-tight ml-7">{desc}</p>
                  <div className="flex gap-2 mt-1.5 ml-7">
                    {choice.outcome.hp !== 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${choice.outcome.hp > 0 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
                        {choice.outcome.hp > 0 ? '+' : ''}{choice.outcome.hp} HP
                      </span>
                    )}
                    {choice.outcome.virtue !== 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${choice.outcome.virtue > 0 ? 'bg-violet-950/60 text-violet-400' : 'bg-red-950/60 text-red-400'}`}>
                        덕목 {choice.outcome.virtue > 0 ? '+' : ''}{choice.outcome.virtue}
                      </span>
                    )}
                    {choice.outcome.move !== 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${choice.outcome.move > 0 ? 'bg-sky-950/60 text-sky-400' : 'bg-red-950/60 text-red-400'}`}>
                        이동 {choice.outcome.move > 0 ? '+' : ''}{choice.outcome.move}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Skip with Angel Feather */}
          {hasFeather && (
            <button
              onClick={skipPurgatorioBattle}
              className="w-full text-center text-[10px] text-stone-500 hover:text-stone-300 py-1 underline"
            >
              {t('sinChoice.skipWithFeather', locale)}
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
