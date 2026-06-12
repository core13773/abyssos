'use client';

import { useEffect, useRef } from 'react';

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-4794002106764884';

type AdFormat = 'auto' | 'horizontal' | 'vertical' | 'rectangle';

interface AdUnitProps {
  /** AdSense ad-slot ID (per ad unit) */
  slot: string;
  /** Ad format — auto by default */
  format?: AdFormat;
  /** Custom class name for wrapper */
  className?: string;
  /** Responsive ads by default */
  responsive?: boolean;
}

/**
 * A single Google AdSense ad unit.
 *
 * Place this component where you want an ad to appear.
 * Each ad unit needs a unique `slot` ID from your AdSense dashboard.
 *
 * @example
 * <AdUnit slot="1234567890" format="horizontal" className="my-4" />
 */
export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  responsive = true,
}: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!AD_CLIENT || !slot || pushedRef.current) return;
    // Push the ad after the AdSense script has loaded
    const timer = setTimeout(() => {
      try {
        if (containerRef.current && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch {
        /* ads blocked or not ready */
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [slot]);

  if (!AD_CLIENT || !slot) return null;

  const isTestMode = process.env.NODE_ENV !== 'production';

  return (
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={{ minHeight: format === 'horizontal' ? 90 : format === 'vertical' ? 250 : 250 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-adtest={isTestMode ? 'on' : undefined}
      />
    </div>
  );
}

// Extend window with AdSense
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>> | undefined;
  }
}
