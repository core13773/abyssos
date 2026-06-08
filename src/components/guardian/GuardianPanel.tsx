'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';

export default function GuardianPanel() {
  const player = useGameStore((s) => s.player);
  const log = useGameStore((s) => s.log);
  const locale = useLocale((s) => s.locale);
  const guardians = player?.guardianCards ?? [];
  const recentLog = log.slice(-3);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] text-stone-500 shrink-0">
          {t('guardian.owned', locale, { n: guardians.length })}
        </span>
        {guardians.length === 0 ? (
          <span className="text-[10px] text-stone-600 italic">{t('guardian.empty', locale)}</span>
        ) : (
          guardians.map((g) => (
            <div
              key={g.id}
              className="shrink-0 w-8 h-8 rounded-full border border-amber-700/50 bg-stone-800 flex items-center justify-center text-xs"
              title={locale === 'en' ? g.nameEn : g.name}
            >
              <object data={`/images/${locale}/guardians/${g.id}.svg`} type="image/svg+xml" className="w-6 h-6 rounded-full">
                ✨
              </object>
            </div>
          ))
        )}
      </div>

      <div className="text-[10px] text-stone-500 space-y-0.5 max-h-14 overflow-hidden">
        {recentLog.map((entry, i) => (
          <p key={i} className="truncate">{entry.message}</p>
        ))}
      </div>
    </div>
  );
}
