'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-4794002106764884';
const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Google AdSense — loads the publisher script and initializes ad units.
 *
 * Set NEXT_PUBLIC_ADSENSE_ID in your environment (e.g. ca-pub-1234567890123456).
 * Ads are only loaded in production (after first paint) to avoid blocking rendering.
 *
 * NOTE: Make sure to add NEXT_PUBLIC_ADSENSE_ID to your GitHub Actions secrets
 * or .env.local before deploying. Without it the script is silently skipped.
 */
export default function GoogleAdSense() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!AD_CLIENT) {
    if (IS_PROD) {
      // eslint-disable-next-line no-console
      console.warn('[AdSense] NEXT_PUBLIC_ADSENSE_ID is not set. Ads will not load.');
    }
    return null;
  }

  // Only load AdSense on the client side after hydration
  if (!mounted) return null;

  return (
    <>
      {/* Google AdSense publisher tag */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        data-adtest={IS_PROD ? undefined : 'on'}
      />
      {/* Request ad units after script loads */}
      <Script id="google-adsense-init" strategy="afterInteractive">
        {`
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch(e) {
            /* AdSense not available — ads may be blocked */
          }
        `}
      </Script>
    </>
  );
}
