'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle SPA fallback redirect from 404.html (GitHub Pages)
    if (typeof window !== 'undefined') {
      const spaRedirect = sessionStorage.getItem('__spa_redirect');
      if (spaRedirect) {
        sessionStorage.removeItem('__spa_redirect');
        router.replace(spaRedirect);
        return;
      }
    }

    const stored = typeof window !== 'undefined' ? localStorage.getItem('abyssos_locale') : null;
    const detected = stored === 'en' || stored === 'ko'
      ? stored
      : navigator.language.startsWith('ko') ? 'ko' : 'en';
    router.replace(`/${detected}/`);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-4">
      <p className="text-2xl animate-pulse">🎲</p>
      <p className="text-sm font-serif italic">
        Lasciate ogne speranza, voi ch&apos;intrate
      </p>
      <p className="text-xs text-stone-600">Loading Abyssos...</p>

      {/* Manual fallback in case redirect is blocked */}
      <div className="flex gap-3 mt-4">
        <a
          href="ko/"
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
        >
          🇰🇷 한국어
        </a>
        <a
          href="en/"
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
        >
          🇺🇸 English
        </a>
      </div>
    </main>
  );
}
