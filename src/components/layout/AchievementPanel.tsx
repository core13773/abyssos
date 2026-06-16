'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import { ACHIEVEMENTS, loadAchievements } from '@/lib/data/achievements';

export default function AchievementPanel() {
  const locale = useLocale((s) => s.locale);
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setUnlocked(loadAchievements());
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const total = ACHIEVEMENTS.length;
  const count = unlocked.length;
  const progress = Math.round((count / total) * 100);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 rounded-xl bg-amber-900/30 border border-amber-700/30 text-amber-300 text-xs font-bold hover:bg-amber-900/50 transition-colors"
      >
        🏆 {locale === 'en' ? `Achievements (${count}/${total})` : `업적 (${count}/${total})`}
      </button>
    );
  }

  return (
    <div className="bg-stone-900/80 border border-amber-700/30 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-amber-300">
          🏆 {locale === 'en' ? 'Achievements' : '업적'}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400">{count}/{total}</span>
          <button onClick={() => setOpen(false)} className="text-[10px] text-stone-500 hover:text-stone-300">✕</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          const isSecret = ach.secret && !isUnlocked;
          return (
            <div
              key={ach.id}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all ${
                isUnlocked ? 'bg-amber-950/30 border border-amber-800/30' : 'bg-stone-950/50 border border-stone-800/30 opacity-60'
              }`}
            >
              <span className={`text-lg ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                {isSecret ? '❓' : ach.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-bold ${isUnlocked ? 'text-amber-200' : 'text-stone-500'}`}>
                  {isSecret ? (locale === 'en' ? '???' : '???') : (locale === 'en' ? ach.nameEn : ach.name)}
                </p>
                <p className="text-[9px] text-stone-500 truncate">
                  {isSecret
                    ? (locale === 'en' ? 'Secret achievement' : '비밀 업적')
                    : (locale === 'en' ? ach.descriptionEn : ach.description)}
                </p>
              </div>
              {isUnlocked && (
                <span className="text-[10px] text-emerald-500 font-bold">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
