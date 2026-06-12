import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import '../globals.css';
import LocaleSync from '@/components/layout/LocaleSync';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';
import GoogleAdSense from '@/components/layout/GoogleAdSense';
import { routing } from '@/i18n/routing';

// Primary domain for production (custom domain), fallback for local dev
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  : process.env.NEXT_PUBLIC_BASE_PATH
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isKo = locale === 'ko';
  const title = isKo ? '어비소스 — 9층 지옥' : 'Abyssos — 9 Circles of Hell';
  const description = isKo
    ? '단테의 9층 지옥을 모티브로 한 전략적 로그라이크 보드게임. 주사위를 굴리고, 타이밍 배틀로 몬스터를 물리치고, 수문장 보스를 격파하며 수호카드를 모아 심연에서 탈출하라.'
    : "A strategic roguelike board game through Dante's 9 circles of Hell. Roll dice, fight monsters with timing skill, defeat unique gatekeeper bosses, collect guardian cards, and escape the abyss.";
  const keywords = isKo
    ? ['어비소스', '단테', '지옥', '신곡', '보드게임', '주사위', '로그라이크', '카드 배틀', '보스전', '수문장', '수호카드', '9층']
    : [
        'abyssos', 'dante', 'inferno', 'hell', 'board game',
        'dice', 'roguelike', 'card battle', 'escape', 'dark fantasy',
        'timing slider', 'boss battle', 'gatekeeper', 'guardian cards',
        '9 circles', 'divine comedy',
      ];

  return {
    title: {
      default: title,
      template: `%s | ${isKo ? '어비소스' : 'Abyssos'}`,
    },
    description,
    keywords,
    authors: [{ name: 'Abyssos' }],
    creator: 'Abyssos',
    publisher: 'Abyssos',
    metadataBase: new URL(`${siteUrl}/${locale}/`),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        'x-default': '/en/',
        en: '/en/',
        ko: '/ko/',
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    appleWebApp: {
      title: isKo ? '어비소스' : 'Abyssos',
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      title,
      description: isKo
        ? '9층 지옥을 통과하며 수호카드를 모아 심연에서 탈출하는 전략적 로그라이크 보드게임.'
        : 'A strategic roguelike board game through the 9 circles of Hell.',
      url: `${siteUrl}/${locale}/`,
      siteName: isKo ? '어비소스' : 'Abyssos',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
      images: [
        {
          url: `${siteUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: isKo ? '어비소스 — 9층 지옥 보드게임' : 'Abyssos — 9 Circles of Hell board game',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: isKo
        ? '9층 지옥을 통과하며 수호카드를 모아 심연에서 탈출하라.'
        : 'A strategic roguelike board game through the 9 circles of Hell.',
      images: [`${siteUrl}/images/og-image.png`],
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
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
    },
    category: 'game',
    applicationName: isKo ? '어비소스' : 'Abyssos',
    generator: 'Next.js',
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        'naver-site-verification': [process.env.NEXT_PUBLIC_NAVER_VERIFICATION].filter(Boolean) as string[],
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ko')) {
    notFound();
  }

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <GoogleAdSense />
      <LocaleSync />
      {children}
    </>
  );
}
