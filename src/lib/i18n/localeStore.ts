'use client';

import { create } from 'zustand';
import type { Locale } from './translations';
import { setActiveLocale } from './translations';

interface LocaleStore {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
}

export const useLocale = create<LocaleStore>((set) => ({
  locale: 'en',
  toggleLocale: () =>
    set((s) => {
      const next = s.locale === 'en' ? 'ko' : 'en';
      setActiveLocale(next);
      return { locale: next };
    }),
  setLocale: (l) => {
    setActiveLocale(l);
    set({ locale: l });
  },
}));

// Initialize the module-level locale
setActiveLocale('en');
