'use client';

import { create } from 'zustand';
import type { Locale } from './translations';
import { setActiveLocale } from './translations';

interface LocaleStore {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
}

function saveLocale(l: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('abyssos_locale', l);
  }
}

function loadLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('abyssos_locale');
    if (stored === 'en' || stored === 'ko') return stored;
  }
  return 'en';
}

export const useLocale = create<LocaleStore>((set) => ({
  locale: 'en',
  toggleLocale: () =>
    set((s) => {
      const next = s.locale === 'en' ? 'ko' : 'en';
      setActiveLocale(next);
      saveLocale(next);
      return { locale: next };
    }),
  setLocale: (l) => {
    setActiveLocale(l);
    saveLocale(l);
    set({ locale: l });
  },
}));

// Initialize the module-level locale
const initialLocale = loadLocale();
setActiveLocale(initialLocale);
useLocale.setState({ locale: initialLocale });
