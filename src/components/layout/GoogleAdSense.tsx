'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID;

/**
 * Google AdSense — loads the publisher script and initializes ad units.
 *
 * Set NEXT_PUBLIC_ADSENSE_ID in your environment (e.g. ca-pub-1234567890123456).
 * Ads are only loaded in production (after first paint) to avoid blocking rendering.
 */
export default function GoogleAdSense() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!AD_CLIENT) return null;
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
