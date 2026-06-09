import type { Metadata, Viewport } from 'next';
import './globals.css';
import LocaleSync from '@/components/layout/LocaleSync';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';

const siteUrl = process.env.NEXT_PUBLIC_BASE_PATH
  ? `https://core13773.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
  : 'http://localhost:3000';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
    { media: '(prefers-color-scheme: light)', color: '#1c1917' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'Abyssos — 9 Circles of Hell',
    template: '%s | Abyssos',
  },
  description:
    'A strategic roguelike board game through Dante\'s 9 circles of Hell. Roll dice, fight monsters with timing skill, defeat unique gatekeeper bosses, collect guardian cards, and escape the abyss.',
  keywords: [
    'abyssos', 'dante', 'inferno', 'hell', 'board game',
    'dice', 'roguelike', 'card battle', 'escape', 'dark fantasy',
    'timing slider', 'boss battle', 'gatekeeper', 'guardian cards',
    '9 circles', 'divine comedy', '단테', '지옥', '신곡',
  ],
  authors: [{ name: 'Abyssos' }],
  creator: 'Abyssos',
  publisher: 'Abyssos',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'ko': '/',
    },
  },
  openGraph: {
    title: 'Abyssos — 9 Circles of Hell',
    description:
      'A strategic roguelike board game through the 9 circles of Hell. Roll dice, defeat monsters, overcome gatekeepers, escape the abyss.',
    url: siteUrl,
    siteName: 'Abyssos',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ko_KR',
    images: [
      {
        url: `${siteUrl}/images/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Abyssos — 9 Circles of Hell board game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abyssos — 9 Circles of Hell',
    description:
      'A strategic roguelike board game through the 9 circles of Hell.',
    images: [`${siteUrl}/images/og-image.svg`],
    creator: '@abyssos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'game',
  applicationName: 'Abyssos',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        <GoogleAnalytics />
        <LocaleSync />
        {children}
      </body>
    </html>
  );
}
