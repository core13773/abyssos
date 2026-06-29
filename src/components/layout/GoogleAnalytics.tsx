'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Tracks SPA route changes. Uses useSearchParams, so it must sit inside a
 * Suspense boundary (required by Next.js static export / prerendering).
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
