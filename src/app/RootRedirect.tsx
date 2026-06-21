'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 루트 `/` 에서 동작하는 클라이언트 사이드 로케일 리디렉트.
 * - GitHub Pages SPA fallback(__spa_redirect) 처리
 * - 저장된 로케일 > 브라우저 언어 > 기본값 'en' 순서로 결정
 * 영어가 기본(default)이며 한국어 브라우저는 /ko/ 로 안내한다.
 */
export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle SPA fallback redirect from 404.html (GitHub Pages)
    const spaRedirect = sessionStorage.getItem('__spa_redirect');
    if (spaRedirect) {
      sessionStorage.removeItem('__spa_redirect');
      router.replace(spaRedirect);
      return;
    }

    const stored = localStorage.getItem('abyssos_locale');
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
          href="en/"
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
        >
          🇺🇸 English
        </a>
        <a
          href="ko/"
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
        >
          🇰🇷 한국어
        </a>
      </div>
    </main>
  );
}
