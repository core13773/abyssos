import type { Metadata } from 'next';
import './globals.css';
import LocaleSync from '@/components/layout/LocaleSync';

export const metadata: Metadata = {
  title: 'Abyssos — 9 Circles of Hell',
  description:
    'A card battle roguelike through the 9 circles of Hell. Roll dice, defeat monsters, collect guardian cards, escape the abyss.',
  keywords: ['tarot', 'dante', 'inferno', 'hell', 'board game', 'dice', 'escape', 'roguelike', 'card battle'],
  openGraph: {
    title: 'Abyssos — 9 Circles of Hell',
    description: 'Escape the 9 circles of Hell. Dice and guardian cards decide your fate.',
    type: 'website',
    locale: 'en_US',
  },
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
      </head>
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        <LocaleSync />
        {children}
      </body>
    </html>
  );
}
