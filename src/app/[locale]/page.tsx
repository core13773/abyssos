'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import { loadCollectedCards, useGameStore } from '@/lib/store/gameStore';
import type { CollectedCards } from '@/lib/store/gameStore';
import { GUARDIANS } from '@/lib/data/guardians';
import { PURIFICATION_CARDS } from '@/lib/data/purgatorio';
import { CELESTIAL_RELICS } from '@/lib/data/paradiso';
import { META_UPGRADES, loadMetaProgress, saveMetaProgress } from '@/lib/data/metaUpgrades';
import AchievementPanel from '@/components/layout/AchievementPanel';
import HiddenBossModal from '@/components/events/HiddenBossModal';
import AdUnit from '@/components/layout/AdUnit';

// ── Card mini-display helpers ──
const ELEMENT_EMOJI: Record<string, string> = {
  ice: '❄️', illusion: '🎭', blood: '🩸', fire: '🔥', mud: '💢', gold: '💰', poison: '☠️', wind: '🌪', holy: '✨',
  earth: '🪨', sight: '👁', smoke: '🌫', lightning: '⚡', crystal: '💎', wood: '🌳', purgefire: '🔥',
  lunar: '🌙', mercurial: '☿', venusian: '♀', solar: '☀', martial: '♂', jovian: '♃', saturnine: '♄', stellar: '⭐', prime: '💫',
};

const REALM_TABS = [
  { id: 'inferno' as const, icon: '🔥', labelKo: '지옥 — 수호카드', labelEn: 'Inferno — Guardians', total: 9 },
  { id: 'purgatorio' as const, icon: '🌅', labelKo: '연옥 — 정화카드', labelEn: 'Purgatorio — Purifications', total: 7 },
  { id: 'paradiso' as const, icon: '✨', labelKo: '천국 — 성물', labelEn: 'Paradiso — Relics', total: 9 },
];

// ── Completion tracking ──
type RealmStatus = 'locked' | 'available' | 'completed';

interface RealmState {
  inferno: { completed: boolean; bestTurns: number | null };
  purgatorio: { completed: boolean; bestTurns: number | null };
  paradiso: { completed: boolean };
}

const DEFAULT_REALM_STATE: RealmState = {
  inferno: { completed: false, bestTurns: null },
  purgatorio: { completed: false, bestTurns: null },
  paradiso: { completed: false },
};

function loadRealmState(): RealmState {
  if (typeof window === 'undefined') return DEFAULT_REALM_STATE;
  try {
    const raw = localStorage.getItem('abyssos_realms');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults — old localStorage data may lack purgatorio/paradiso keys
      return {
        inferno: { ...DEFAULT_REALM_STATE.inferno, ...(parsed.inferno || {}) },
        purgatorio: { ...DEFAULT_REALM_STATE.purgatorio, ...(parsed.purgatorio || {}) },
        paradiso: { ...DEFAULT_REALM_STATE.paradiso, ...(parsed.paradiso || {}) },
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_REALM_STATE;
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
    lockedReasonKo: '지옥을 먼저 탈출하세요',
    lockedReasonEn: 'Escape Hell first',
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
    lockedReasonKo: '연옥을 먼저 정화하세요',
    lockedReasonEn: 'Purify Purgatory first',
  },
];

// ── Meta Upgrade Panel ──
function MetaUpgradePanel({ locale }: { locale: 'en' | 'ko' }) {
  const [meta, setMeta] = useState(loadMetaProgress());
  const [open, setOpen] = useState(false);

  const handleUpgrade = (id: string, cost: number) => {
    const current = meta.upgrades[id] || 0;
    const upgrade = META_UPGRADES.find((u) => u.id === id);
    if (!upgrade || current >= upgrade.maxLevel) return;
    if (meta.soulStones < cost) return;
    const next = {
      ...meta,
      soulStones: meta.soulStones - cost,
      upgrades: { ...meta.upgrades, [id]: current + 1 },
    };
    saveMetaProgress(next);
    setMeta(next);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-300 text-xs font-bold hover:bg-purple-900/60 transition-colors"
      >
        ✨ {locale === 'en' ? `Meta Upgrades (${meta.soulStones} stones)` : `메타 업그레이드 (${meta.soulStones}석)`}
      </button>
    );
  }

  return (
    <div className="bg-stone-900/80 border border-purple-700/40 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-purple-300">
          ✨ {locale === 'en' ? 'Meta Upgrades' : '메타 업그레이드'}
        </h3>
        <span className="text-[10px] text-purple-400">✨ {meta.soulStones}</span>
        <button onClick={() => setOpen(false)} className="text-[10px] text-stone-500 hover:text-stone-300">✕</button>
      </div>
      <div className="flex flex-col gap-1.5">
        {META_UPGRADES.map((u) => {
          const level = meta.upgrades[u.id] || 0;
          const cost = u.costPerLevel * (level + 1);
          const canAfford = meta.soulStones >= cost && level < u.maxLevel;
          return (
            <div key={u.id} className="flex items-center justify-between bg-stone-950/50 rounded-lg px-2 py-1.5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-stone-300">{locale === 'en' ? u.nameEn : u.name}</p>
                <p className="text-[9px] text-stone-500 truncate">{locale === 'en' ? u.descriptionEn : u.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] text-purple-400">Lv.{level}/{u.maxLevel}</span>
                <button
                  onClick={() => handleUpgrade(u.id, cost)}
                  disabled={!canAfford}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition-colors ${
                    canAfford
                      ? 'bg-purple-700 text-white hover:bg-purple-600'
                      : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  {level >= u.maxLevel ? (locale === 'en' ? 'MAX' : '최대') : `${cost}✨`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Color palette per realm for inline style fallback ──
const AD_SLOT_MAIN = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN;

const REALM_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  inferno:    { bg: '#3b1108', border: '#991b1b', text: '#f87171', glow: '#ef444433' },
  purgatorio: { bg: '#1e1035', border: '#7e22ce', text: '#c084fc', glow: '#a855f733' },
  paradiso:   { bg: '#291d0c', border: '#d97706', text: '#fcd34d', glow: '#f59e0b33' },
};

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
  const colors = REALM_COLORS[realm.id] || REALM_COLORS.inferno;

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
      style={{
        background: `linear-gradient(to bottom, #0c0a09, ${colors.glow}, #0c0a09)`,
        borderColor: colors.border,
        opacity: isLocked ? 0.55 : 1,
        filter: isLocked ? 'saturate(0.5)' : undefined,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
      className="relative rounded-2xl border overflow-hidden transition-all duration-500"
      onClick={() => !isLocked && onSelect(realm)}
    >
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
          <div className="flex items-center gap-1.5" style={{ color: colors.text }}>
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
        <h2 className="text-xl sm:text-2xl font-bold font-serif" style={{ color: colors.text }}>
          {title}
        </h2>
        <p className="text-xs text-stone-400 font-serif italic mt-0.5 mb-2">
          {subtitle}
        </p>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed mb-3"
           style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {desc}
        </p>

        {/* Stats row */}
        <div className="flex gap-2 text-[9px] sm:text-[10px]">
          <span className="px-2 py-1 rounded-full bg-stone-900/60" style={{ border: `1px solid ${colors.border}` }}>
            📐 {realm.chapters}
          </span>
          <span className="px-2 py-1 rounded-full bg-stone-900/60" style={{ border: `1px solid ${colors.border}` }}>
            🃏 {realm.cardCount}
          </span>
          <span className="px-2 py-1 rounded-full bg-stone-900/60" style={{ border: `1px solid ${colors.border}` }}>
            {realm.icon} {realm.bossType}
          </span>
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="mt-3 text-center">
            <p className="text-[10px] text-stone-500 italic">
              🔒 {locale === 'en' ? realm.lockedReasonEn : realm.lockedReasonKo}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ── Card Thumbnail (collection gallery) ──
function CardThumbnail({
  name, effect, element, isCollected, locale,
}: {
  id: string; name: string; effect: string; element: string; isCollected: boolean; locale: 'en' | 'ko';
}) {
  const emoji = ELEMENT_EMOJI[element] || '🃏';
  return (
    <motion.div
      whileHover={isCollected ? { scale: 1.05 } : {}}
      className={`rounded-xl border p-2 flex flex-col items-center text-center transition-all ${
        isCollected
          ? 'bg-stone-800/80 border-amber-700/40 cursor-default'
          : 'bg-stone-900/30 border-stone-800/30 opacity-40'
      }`}
      title={isCollected ? `${name}: ${effect}` : (locale === 'en' ? 'Not yet collected' : '아직 획득하지 못한 카드')}
    >
      {/* Element emoji */}
      <span className="text-lg mb-0.5">{isCollected ? emoji : '❓'}</span>

      {/* Card name */}
      <span className={`text-[9px] font-bold leading-tight line-clamp-1 ${isCollected ? 'text-stone-200' : 'text-stone-600'}`}>
        {name}
      </span>

      {/* Effect */}
      <span className={`text-[8px] leading-tight mt-0.5 line-clamp-2 ${isCollected ? 'text-stone-400' : 'text-stone-700'}`}>
        {effect}
      </span>

      {/* Collected indicator */}
      {isCollected && (
        <span className="text-[8px] text-emerald-600 mt-0.5">✓</span>
      )}
    </motion.div>
  );
}

// ── Main Page ──
export default function HomePage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const [realmState, setRealmState] = useState<RealmState>(() => loadRealmState());
  const [collectedCards, setCollectedCards] = useState<CollectedCards>(() => loadCollectedCards());
  const [activeTab, setActiveTab] = useState<'inferno' | 'purgatorio' | 'paradiso'>('inferno');
  const [showHiddenBoss, setShowHiddenBoss] = useState(false);

  useEffect(() => {
    const onStorage = () => {
      setRealmState(loadRealmState());
      setCollectedCards(loadCollectedCards());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Determine status per realm — with progressive gating
  const getStatus = (realmId: string): RealmStatus => {
    if (realmId === 'inferno') {
      return realmState.inferno.completed ? 'completed' : 'available';
    }
    if (realmId === 'purgatorio') {
      if (realmState.purgatorio.completed) return 'completed';
      if (!realmState.inferno.completed) return 'locked';
      return 'available';
    }
    if (realmId === 'paradiso') {
      if (realmState.paradiso.completed) return 'completed';
      if (!realmState.purgatorio.completed) return 'locked';
      return 'available';
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
      router.push(`/${locale}/game?era=inferno`);
    } else {
      router.push(`/${locale}/game?era=${realm.era}`);
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

        {/* Language toggle */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-3"
        >
          <button
            onClick={() => {
              const next = locale === 'en' ? 'ko' : 'en';
              window.location.href = `/${next}/`;
            }}
            className="text-[11px] px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700/40 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-colors"
            aria-label={locale === 'en' ? 'Switch to Korean' : 'Switch to English'}
          >
            {locale === 'en' ? '🇰🇷 한국어' : '🇺🇸 English'}
          </button>
        </motion.div>

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
        {REALMS.map((realm, i) => {
          const status = getStatus(realm.id);
          return (
            <RealmCard
              key={realm.id}
              realm={realm}
              status={status}
              bestTurns={getBestTurns(realm.id)}
              index={i}
              onSelect={handleSelect}
              locale={locale}
            />
          );
        })}
      </section>

      {/* ── Card Collection Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full max-w-md z-10 mb-6"
        aria-label={locale === 'ko' ? '카드 컬렉션' : 'Card Collection'}
      >
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🃏</span>
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {locale === 'en' ? 'Card Collection' : '카드 컬렉션'}
          </h2>
          <span className="text-[10px] text-stone-600 ml-auto">
            {collectedCards.inferno.length + collectedCards.purgatorio.length + collectedCards.paradiso.length}/25
          </span>
        </div>

        {/* Realm Tabs */}
        <div className="flex gap-1 mb-3">
          {REALM_TABS.map((tab) => {
            const collected = collectedCards[tab.id]?.length ?? 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${
                  isActive
                    ? 'bg-stone-800 border-amber-700/50 text-amber-400'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500 hover:text-stone-300'
                }`}
              >
                <span className="block text-center">
                  {tab.icon} {locale === 'en' ? tab.labelEn.split(' — ')[0] : tab.labelKo.split(' — ')[0]}
                </span>
                <span className={`text-[9px] ${collected > 0 ? 'text-emerald-500' : 'text-stone-600'}`}>
                  {collected}/{tab.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-3 gap-2">
          {activeTab === 'inferno' && GUARDIANS.map((card) => {
            const isCollected = collectedCards.inferno.includes(card.id);
            return (
              <CardThumbnail
                key={card.id}
                id={card.id}
                name={locale === 'en' ? card.nameEn : card.name}
                effect={locale === 'en' ? card.mainEffectEn : card.mainEffect}
                element={card.element}
                isCollected={isCollected}
                locale={locale}
              />
            );
          })}
          {activeTab === 'purgatorio' && PURIFICATION_CARDS.map((card) => {
            const isCollected = collectedCards.purgatorio.includes(card.id);
            return (
              <CardThumbnail
                key={card.id}
                id={card.id}
                name={locale === 'en' ? card.nameEn : card.name}
                effect={locale === 'en' ? card.mainEffectEn : card.mainEffect}
                element={card.element}
                isCollected={isCollected}
                locale={locale}
              />
            );
          })}
          {activeTab === 'paradiso' && CELESTIAL_RELICS.map((card) => {
            const isCollected = collectedCards.paradiso.includes(card.id);
            return (
              <CardThumbnail
                key={card.id}
                id={card.id}
                name={locale === 'en' ? card.nameEn : card.name}
                effect={locale === 'en' ? card.effectEn : card.effect}
                element={card.element}
                isCollected={isCollected}
                locale={locale}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {activeTab === 'inferno' && collectedCards.inferno.length === 0 && !realmState.inferno.completed && (
          <p className="text-[10px] text-stone-600 text-center mt-2 italic">
            {locale === 'en' ? 'Play Inferno to collect Guardian cards!' : '지옥편을 플레이하여 수호카드를 모아보세요!'}
          </p>
        )}
        {activeTab === 'purgatorio' && collectedCards.purgatorio.length === 0 && !realmState.purgatorio.completed && (
          <p className="text-[10px] text-stone-600 text-center mt-2 italic">
            {locale === 'en' ? 'Complete Inferno, then play Purgatorio!' : '지옥편을 클리어하고 연옥편에서 모아보세요!'}
          </p>
        )}
        {activeTab === 'paradiso' && collectedCards.paradiso.length === 0 && !realmState.paradiso.completed && (
          <p className="text-[10px] text-stone-600 text-center mt-2 italic">
            {locale === 'en' ? 'Complete Purgatorio, then play Paradiso!' : '연옥편을 클리어하고 천국편에서 모아보세요!'}
          </p>
        )}
      </motion.section>

      {/* Meta Upgrades */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-full max-w-md z-10 mb-4"
      >
        <MetaUpgradePanel locale={locale} />
      </motion.section>

      {/* NG+ Button */}
      {totalCompleted >= 3 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="w-full max-w-md z-10 mb-4"
        >
          <button
            onClick={() => {
              useGameStore.getState().startNGPlus();
              router.push('/game');
            }}
            className="w-full py-3 rounded-xl bg-red-900/40 border border-red-700/40 text-red-300 text-sm font-bold hover:bg-red-900/60 transition-colors animate-pulse"
          >
            ♾️ {locale === 'en' ? 'NEW GAME+' : '새 게임+'}
          </button>
          <p className="text-[10px] text-stone-600 text-center mt-1">
            {locale === 'en' ? 'Monsters +2 power, rewards x1.5' : '몬스터 전투력 +2, 보상 1.5배'}
          </p>
        </motion.section>
      )}

      {/* Hidden Boss */}
      {totalCompleted >= 3 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.78 }}
          className="w-full max-w-md z-10 mb-4"
        >
          <button
            onClick={() => setShowHiddenBoss(true)}
            className="w-full py-3 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-300 text-sm font-bold hover:bg-purple-900/60 transition-colors"
          >
            🌑 {locale === 'en' ? 'Abyss Challenge' : '심연 도전'}
          </button>
          <p className="text-[10px] text-stone-600 text-center mt-1">
            {locale === 'en' ? 'Defeat Corrupted Virgil' : '타락한 베르길리우스 처치'}
          </p>
        </motion.section>
      )}

      <HiddenBossModal open={showHiddenBoss} onClose={() => setShowHiddenBoss(false)} />

      {/* Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="w-full max-w-md z-10 mb-4"
      >
        <AchievementPanel />
      </motion.section>

      {/* AdSense — placed above footer with safe spacing */}
      {AD_SLOT_MAIN && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="w-full max-w-md z-10 mb-4"
          aria-label={locale === 'ko' ? '광고' : 'Advertisement'}
        >
          <AdUnit slot={AD_SLOT_MAIN} format="horizontal" responsive className="my-2" />
        </motion.section>
      )}

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
          Abyssos V0.2 — Built with Next.js
        </p>
        <p className="mt-2 text-stone-600">
          {locale === 'en' ? 'Feedback:' : '피드백:'}{' '}
          <a
            href="mailto:core13773@gmail.com"
            className="underline hover:text-stone-400 transition-colors"
            aria-label={locale === 'en' ? 'Send feedback email' : '피드백 이메일 복사'}
          >
            core13773@gmail.com
          </a>
        </p>
      </motion.footer>
    </main>
  );
}
