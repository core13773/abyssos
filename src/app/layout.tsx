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
        <meta name="google-adsense-account" content="ca-pub-4794002106764884" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4794002106764884"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
