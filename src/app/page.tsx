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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-950 via-red-950/20 to-stone-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 z-10 px-2"
      >
        <p className="text-amber-600/60 text-xs sm:text-sm tracking-[0.3em] mb-3 font-serif italic">
          Lasciate ogne speranza, voi ch&apos;intrate
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-red-600 mb-2">
          Abyssos
        </h1>
        <p className="text-lg sm:text-xl text-stone-400 font-serif">9 Circles of Hell</p>
        <p className="text-stone-500 mt-2 max-w-md mx-auto leading-relaxed text-xs sm:text-sm whitespace-pre-line">
          {t('home.tagline', locale)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 gap-2 sm:gap-3 mb-8 z-10 max-w-xs w-full"
      >
        {[
          { icon: '🎲', label: 'Dice', desc: '2D6 Movement' },
          { icon: '👾', label: 'Monsters', desc: '18 Types' },
          { icon: '👹', label: 'Gatekeepers', desc: '9 Bosses' },
          { icon: '✨', label: 'Guardians', desc: '9 Blessings' },
        ].map((feat) => (
          <div key={feat.label} className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-center hover:border-amber-800/40 transition-colors">
            <p className="text-xl mb-1">{feat.icon}</p>
            <p className="text-[10px] font-bold text-stone-300">{feat.label}</p>
            <p className="text-[9px] text-stone-500">{feat.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="z-10">
        <Button variant="primary" size="lg" onClick={() => router.push('/game')}>
          🔥 Enter Hell
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-6 text-stone-600 text-[10px] text-center max-w-xs z-10 italic"
      >
        &ldquo;Nel mezzo del cammin di nostra vita<br />mi ritrovai per una selva oscura&rdquo;
        <br /><span className="text-stone-700">— Dante, Inferno, Canto I</span>
      </motion.p>
    </div>
  );
}
