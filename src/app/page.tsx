'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);

  const embers = useMemo(
    () => Array.from({ length: 15 }, (_, i) => ({
      left: 10 + pseudoRandom(i * 7 + 1) * 80,
      top: 10 + pseudoRandom(i * 7 + 2) * 80,
      yEnd: -30 - pseudoRandom(i * 7 + 3) * 60,
      duration: 2 + pseudoRandom(i * 7 + 4) * 4,
      delay: pseudoRandom(i * 7 + 5) * 4,
    })),
    [],
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: 'Abyssos — 9 Circles of Hell',
            description: 'A strategic roguelike board game through the 9 circles of Hell.',
            url: 'https://core13773.github.io/abyssos',
            playMode: 'SinglePlayer',
            applicationCategory: 'Game',
            genre: ['Roguelike', 'Board Game', 'Card Battle', 'Dark Fantasy'],
            operatingSystem: 'Web',
            author: { '@type': 'Organization', name: 'Abyssos' },
            datePublished: '2026-06-09',
            inLanguage: ['en', 'ko'],
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-950 via-red-950/20 to-stone-950" aria-labelledby="hero-title">
      {/* Ambient ember particles (decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {embers.map((ember, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            initial={{ left: `${ember.left}%`, top: `${ember.top}%` }}
            animate={{ y: [0, ember.yEnd], opacity: [0, 0.6, 0] }}
            transition={{ duration: ember.duration, repeat: Infinity, delay: ember.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Hero */}
      <header className="text-center mb-8 z-10 px-2">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-amber-600/60 text-xs sm:text-sm tracking-[0.3em] mb-3 font-serif italic"
          aria-label="Lasciate ogni speranza, voi ch'entrate"
        >
          Lasciate ogne speranza, voi ch&apos;intrate
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-red-600 mb-2"
        >
          Abyssos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-lg sm:text-xl text-stone-400 font-serif"
        >
          9 Circles of Hell
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-stone-500 mt-2 max-w-md mx-auto leading-relaxed text-xs sm:text-sm whitespace-pre-line"
        >
          {t('home.tagline', locale)}
        </motion.p>
      </header>

      {/* Features grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 gap-2 sm:gap-3 mb-8 z-10 max-w-xs w-full"
        aria-label={locale === 'ko' ? '게임 특징' : 'Game Features'}
      >
        <h2 className="sr-only">{locale === 'ko' ? '게임 특징' : 'Game Features'}</h2>
        {[
          { icon: '🎲', label: 'Dice', desc: '2D6 Movement' },
          { icon: '👾', label: 'Monsters', desc: '18 Types' },
          { icon: '👹', label: 'Gatekeepers', desc: '9 Bosses' },
          { icon: '✨', label: 'Guardians', desc: '9 Blessings' },
        ].map((feat) => (
          <article key={feat.label} className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-center hover:border-amber-800/40 transition-colors">
            <p className="text-xl mb-1" aria-hidden="true">{feat.icon}</p>
            <h3 className="text-[10px] font-bold text-stone-300">{feat.label}</h3>
            <p className="text-[9px] text-stone-500">{feat.desc}</p>
          </article>
        ))}
      </motion.section>

      {/* CTA */}
      <motion.nav
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="z-10"
        aria-label={locale === 'ko' ? '게임 시작' : 'Start Game'}
      >
        <Button variant="primary" size="lg" onClick={() => router.push('/game')}>
          🔥 {locale === 'ko' ? '지옥에 입장하기' : 'Enter Hell'}
        </Button>
      </motion.nav>

      {/* Dante quote */}
      <motion.blockquote
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-6 text-stone-600 text-[10px] text-center max-w-xs z-10 italic"
        cite="https://en.wikipedia.org/wiki/Inferno_(Dante)"
      >
        <p>&ldquo;Nel mezzo del cammin di nostra vita<br />mi ritrovai per una selva oscura&rdquo;</p>
        <footer className="text-stone-700 mt-1">— Dante Alighieri, <cite>Inferno</cite>, Canto I</footer>
      </motion.blockquote>
    </main>
    </>
  );
}
