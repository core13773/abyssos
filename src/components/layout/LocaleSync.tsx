'use client';

import { useEffect } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

/**
 * Syncs the <html lang> attribute with the current locale.
 * Rendered inside the body so it can read the Zustand locale store.
 */
export default function LocaleSync() {
  const locale = useLocale((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
