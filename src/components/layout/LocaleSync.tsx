'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n/localeStore';

/**
 * Syncs the <html lang> attribute with the current locale
 * and keeps the Zustand store in sync with the URL locale.
 */
export default function LocaleSync() {
  const pathname = usePathname();
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!pathname) return;
    const segment = pathname.split('/')[1];
    if ((segment === 'ko' || segment === 'en') && segment !== locale) {
      setLocale(segment);
    }
  }, [pathname, locale, setLocale]);

  return null;
}
