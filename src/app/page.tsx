'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import { t } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';

// ── Completion tracking ──
type RealmStatus = 'locked' | 'available' | 'completed';

interface RealmState {
  inferno: { completed: boolean; bestTurns: number | null };
  purgatorio: { completed: boolean; bestTurns: number | null };
  paradiso: { completed: boolean };
}

function loadRealmState(): RealmState {
  if (typeof window === 'undefined') return { inferno: { completed: false, bestTurns: null }, purgatorio: { completed: false, bestTurns: null }, paradiso: { completed: false } };
  try {
    const raw = localStorage.getItem('abyssos_realms');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { inferno: { completed: false, bestTurns: null }, purgatorio: { completed: false, bestTurns: null }, paradiso: { completed: false } };
}

// ── Helper for pseudo-random particles ──
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Realm Card data ──
interface RealmCardData {
  id: string;
  era: 'inferno' | 'purgatorio' | 'paradiso';
  titleKo: string;
  titleEn: string;
  subtitleKo: string;
  subtitleEn: string;
  descKo: string;
  descEn: string;
  icon: string;
  gradient: string;
  borderColor: string;
  accentColor: string;
  textAccent: string;
  particleColors: string[];
  chapters: string;
  cardCount: string;
  bossType: string;
  lockedReasonKo?: string;
  lockedReasonEn?: string;
}

const REALMS: RealmCardData[] = [
  {
    id: 'inferno',
    era: 'inferno',
    titleKo: '지옥',
    titleEn: 'Inferno',
    subtitleKo: '아홉 지옥의 탈출',
    subtitleEn: 'Escape the 9 Circles',
    descKo: '지옥의 가장 깊은 곳, 코퀴토스의 얼음에서 깨어나 9층을 통과해 탈출하라. 수문장을 물리치고 수호카드를 모아라.',
    descEn: 'Awaken in the frozen depths of Cocytus. Ascend through 9 circles, defeat gatekeepers, and collect guardian cards.',
    icon: '🔥',
    gradient: 'from-stone-950 via-red-950/30 to-stone-950',
    borderColor: 'border-red-700/50',
    accentColor: 'bg-red-600',
    textAccent: 'text-red-400',
    particleColors: ['bg-red-500/30', 'bg-amber-500/20', 'bg-orange-600/25'],
    chapters: '9 Circles',
    cardCount: '9 Guardians',
    bossType: 'Gatekeepers',
  },
  {
    id: 'purgatorio',
    era: 'purgatorio',
    titleKo: '연옥',
    titleEn: 'Purgatorio',
    subtitleKo: '일곱 테라스의 정화',
    subtitleEn: 'Purify on 7 Terraces',
    descKo: '지옥을 탈출한 영혼이여, 연옥산을 올라라. 죄의 투영을 극복하고 수호천사의 시험을 통과해 베아트리체를 만나라.',
    descEn: 'Soul escaped from Hell, climb Mount Purgatory. Overcome sin projections, pass angelic trials, and meet Beatrice.',
    icon: '🌅',
    gradient: 'from-stone-950 via-purple-950/30 to-stone-950',
    borderColor: 'border-purple-700/50',
    accentColor: 'bg-purple-600',
    textAccent: 'text-purple-400',
    particleColors: ['bg-purple-500/20', 'bg-violet-500/15', 'bg-indigo-500/20'],
    chapters: '7 Terraces',
    cardCount: '7 Purifications',
    bossType: 'Angels',
  },
  {
    id: 'paradiso',
    era: 'paradiso',
    titleKo: '천국',
    titleEn: 'Paradiso',
    subtitleKo: '아홉 천구의 비상',
    subtitleEn: 'Ascend the 9 Spheres',
    descKo: '연옥의 정상에서 별 너머로. 9개의 천구를 지나 엠피리오의 빛에 도달하라. 대천사의 시험을 통과하고 성물을 모아라.',
    descEn: 'Beyond the stars from Purgatory\'s summit. Traverse 9 celestial spheres to reach the Empyrean. Pass the trials of archangels.',
    icon: '✨',
    gradient: 'from-stone-950 via-amber-950/20 to-stone-950',
    borderColor: 'border-amber-600/40',
    accentColor: 'bg-amber-500',
    textAccent: 'text-amber-300',
    particleColors: ['bg-amber-300/15', 'bg-yellow-400/10', 'bg-white/10'],
    chapters: '9 Spheres',
    cardCount: '9 Relics',
    bossType: 'Archangels',
  },
];

// ── Individual Realm Card ──
function RealmCard({
  realm,
  status,
  bestTurns,
  index,
  onSelect,
  locale,
}: {
  realm: RealmCardData;
  status: RealmStatus;
  bestTurns: number | null;
  index: number;
  onSelect: (realm: RealmCardData) => void;
  locale: 'en' | 'ko';
}) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const title = locale === 'en' ? realm.titleEn : realm.titleKo;
  const subtitle = locale === 'en' ? realm.subtitleEn : realm.subtitleKo;
  const desc = locale === 'en' ? realm.descEn : realm.descKo;

  // Particles for background
  const particles = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({
      x: 10 + pseudoRandom(index * 10 + i * 3 + 1) * 80,
      y: 10 + pseudoRandom(index * 10 + i * 3 + 2) * 80,
      delay: pseudoRandom(index * 10 + i * 3 + 3) * 4,
      duration: 3 + pseudoRandom(index * 10 + i * 3 + 4) * 5,
      color: realm.particleColors[i % realm.particleColors.length],
    })),
    [index, realm.particleColors],
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 * index, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
      className={`
        relative rounded-2xl border ${realm.borderColor} overflow-hidden
        ${isLocked ? 'opacity-50 saturate-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-500
      `}
      onClick={() => !isLocked && onSelect(realm)}
    >
      {/* Animated gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-b ${realm.gradient}`} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${p.color}`}
            initial={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ y: [0, -20, 10, -30], opacity: [0, 0.7, 0.4, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-5">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-1.5 ${realm.textAccent}`}>
            <span className="text-xl" aria-hidden="true">{realm.icon}</span>
            {isCompleted && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-700/40">
                {locale === 'en' ? '✓ CLEARED' : '✓ 클리어'}
              </span>
            )}
            {isLocked && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-800/80 text-stone-500 border border-stone-700/40">
                🔒 {locale === 'en' ? 'LOCKED' : '잠금'}
              </span>
            )}
          </div>
          {bestTurns !== null && (
            <span className="text-[10px] text-stone-500 font-mono">
              🏆 {bestTurns} {locale === 'en' ? 'turns' : '턴'}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-xl sm:text-2xl font-bold font-serif ${realm.textAccent}`}>
          {title}
        </h2>
        <p className="text-xs text-stone-400 font-serif italic mt-0.5 mb-2">
          {subtitle}
        </p>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed line-clamp-2 mb-3">
          {desc}
        </p>

        {/* Stats row */}
        <div className="flex gap-2 text-[9px] sm:text-[10px]">
          <span className={`px-2 py-1 rounded-full ${realm.borderColor} bg-stone-900/60`}>
            📐 {realm.chapters}
          </span>
          <span className={`px-2 py-1 rounded-full ${realm.borderColor} bg-stone-900/60`}>
            🃏 {realm.cardCount}
          </span>
          <span className={`px-2 py-1 rounded-full ${realm.borderColor} bg-stone-900/60`}>
            {realm.icon} {realm.bossType}
          </span>
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="mt-3 text-center">
            <p className="text-[10px] text-stone-600 italic">
              🔒 {locale === 'en' ? realm.lockedReasonEn : realm.lockedReasonKo}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ── Main Page ──
export default function HomePage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const [realmState, setRealmState] = useState<RealmState>({
    inferno: { completed: false, bestTurns: null },
    purgatorio: { completed: false, bestTurns: null },
    paradiso: { completed: false },
  });

  useEffect(() => {
    setRealmState(loadRealmState());

    // Listen for storage updates from game page
    const onStorage = () => setRealmState(loadRealmState());
    window.addEventListener('storage', onStorage);
    // Also poll for changes (cross-tab sync)
    const interval = setInterval(() => {
      const current = loadRealmState();
      setRealmState((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(current)) return current;
        return prev;
      });
    }, 2000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  // Determine status per realm
  const getStatus = (realmId: string): RealmStatus => {
    if (realmId === 'inferno') {
      return realmState.inferno.completed ? 'completed' : 'available';
    }
    if (realmId === 'purgatorio') {
      return realmState.purgatorio.completed ? 'completed' : 'available';
    }
    if (realmId === 'paradiso') {
      return realmState.paradiso.completed ? 'completed' : 'available';
    }
    return 'available';
  };

  const getBestTurns = (realmId: string): number | null => {
    if (realmId === 'inferno') return realmState.inferno.bestTurns;
    if (realmId === 'purgatorio') return realmState.purgatorio.bestTurns;
    return null;
  };

  const handleSelect = (realm: RealmCardData) => {
    if (realm.era === 'inferno') {
      router.push('/game?era=inferno');
    } else {
      router.push(`/game?era=${realm.era}`);
    }
  };

  // Ambient ember particles
  const embers = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      left: 10 + pseudoRandom(i * 7 + 1) * 80,
      top: 10 + pseudoRandom(i * 7 + 2) * 80,
      yEnd: -30 - pseudoRandom(i * 7 + 3) * 60,
      duration: 2 + pseudoRandom(i * 7 + 4) * 4,
      delay: pseudoRandom(i * 7 + 5) * 4,
    })),
    [],
  );

  const totalCompleted = [realmState.inferno.completed, realmState.purgatorio.completed, realmState.paradiso.completed].filter(Boolean).length;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-stone-950 relative" aria-labelledby="hero-title">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: 'Abyssos — The Divine Comedy Trilogy',
            description: 'A strategic roguelike board game through the 9 circles of Hell, 7 terraces of Purgatory, and 9 spheres of Paradise.',
            url: 'https://core13773.github.io/abyssos',
            playMode: 'SinglePlayer',
            applicationCategory: 'Game',
            genre: ['Roguelike', 'Board Game', 'Card Battle', 'Dark Fantasy'],
            operatingSystem: 'Web',
            author: { '@type': 'Organization', name: 'Abyssos' },
            datePublished: '2026-06-10',
            inLanguage: ['en', 'ko'],
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />

      {/* Ambient ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {embers.map((ember, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/20 rounded-full"
            initial={{ left: `${ember.left}%`, top: `${ember.top}%` }}
            animate={{ y: [0, ember.yEnd], opacity: [0, 0.5, 0] }}
            transition={{ duration: ember.duration, repeat: Infinity, delay: ember.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="text-center mb-6 sm:mb-8 z-10 pt-6 sm:pt-10">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-amber-600/50 text-xs sm:text-sm tracking-[0.3em] mb-3 font-serif italic"
        >
          Lasciate ogne speranza, voi ch&apos;intrate
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-red-600 mb-2"
        >
          Abyssos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-sm sm:text-base text-stone-400 font-serif tracking-wider"
        >
          {locale === 'en' ? 'The Divine Comedy Trilogy' : '신곡 3부작'}
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-700 ${
                  step <= totalCompleted ? 'bg-amber-400 shadow-lg shadow-amber-500/50 scale-125' :
                  step === totalCompleted + 1 ? 'bg-stone-500 animate-pulse' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-stone-600 font-mono">
            {totalCompleted}/3
          </span>
        </motion.div>
      </header>

      {/* Realm Selection Cards */}
      <section className="w-full max-w-md z-10 flex flex-col gap-3 sm:gap-4 pb-8" aria-label={locale === 'ko' ? '세계 선택' : 'Realm Selection'}>
        <h2 className="sr-only">{locale === 'ko' ? '여정을 선택하세요' : 'Choose your journey'}</h2>
        {REALMS.map((realm, i) => (
          <RealmCard
            key={realm.id}
            realm={realm}
            status={getStatus(realm.id)}
            bestTurns={getBestTurns(realm.id)}
            index={i}
            onSelect={handleSelect}
            locale={locale}
          />
        ))}
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="text-stone-700 text-[10px] text-center pb-4 z-10"
      >
        <p className="font-serif italic">
          {locale === 'en'
            ? '"The path to paradise begins in hell." — Dante Alighieri'
            : '"천국으로 가는 길은 지옥에서 시작된다." — 단테 알리기에리'}
        </p>
        <p className="mt-1 text-stone-800">
          Abyssos v6.0 — Built with Next.js
        </p>
      </motion.footer>
    </main>
  );
}
