import type { ReactNode } from 'react';
import './globals.css';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="google-site-verification" content="H7mODFbLsLZQVighNNZBIlFHoInuoI881YleLZ7b4vo" />
        <meta name="naver-site-verification" content="f2ee86bf2dbffd9f349214dc82766bbf8066ed00" />
        <meta name="6c892d6b7362da74026ce3e0881ee31bcb5b9ef0" content="6c892d6b7362da74026ce3e0881ee31bcb5b9ef0" />
        <script data-cfasync="false" type="text/javascript" src="https://pleased-report.com/bC3WV/0.Px3Cppv/bbmXV_JvZCDG0B3gMNTLgTwNMhzLY/xjLdTIcgxhORDKAGzHN/joUB"></script>
        {/* HilltopAds — native/push (desktop & mobile) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(ulmerx){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=ulmerx||{};s.src='//massivesalad.com/b/XsV.s/dyGslV0nYwW/cy/De/mV9fu/ZZUClrkBPJTXcox/OCDGAg1/MDDZk/tTNezNEn4/M/D/UIxjM/wk';s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`,
          }}
        />
      </head>
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
