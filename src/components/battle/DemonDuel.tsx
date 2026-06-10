'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';
import WhackMole from './WhackMole';
import TapRunner from './TapRunner';
import QuickDecision from './QuickDecision';
import LightPath from './LightPath';
import MemoryFlip from './MemoryFlip';

type Tier = 'easy' | 'med' | 'hard';

// ── Movement mini-game roster ───────────────────────────────────────────────
// Inferno movement is no longer a single repeated game. Each turn rotates to a
// different reflex/skill game; the score becomes the move distance (capped).
const ROSTER = [
  {
    id: 'whack',
    emoji: '👹',
    name: { en: 'Demon Whack', ko: '악마 두더지' },
    hint: { en: 'Whack the demons as they pop up!', ko: '튀어나오는 악마를 잡아라!' },
    render: (tier: Tier, onResult: (s: boolean, n: number) => void) => (
      <WhackMole
        targetCount={tier === 'easy' ? 3 : tier === 'med' ? 4 : 5}
        appearTime={tier === 'easy' ? 1000 : tier === 'med' ? 850 : 750}
        spawnInterval={tier === 'easy' ? 1100 : tier === 'med' ? 950 : 820}
        totalTime={tier === 'easy' ? 11 : 10}
        onResult={onResult}
      />
    ),
  },
  {
    id: 'tap',
    emoji: '🎯',
    name: { en: 'Soul Timing', ko: '영혼의 타이밍' },
    hint: { en: 'Stop the marker in the green zone!', ko: '초록 구간에서 멈춰라!' },
    render: (tier: Tier, onResult: (s: boolean, n: number) => void) => (
      <TapRunner
        rounds={6}
        targetHits={tier === 'easy' ? 2 : tier === 'med' ? 3 : 4}
        sweepMs={tier === 'easy' ? 1500 : tier === 'med' ? 1200 : 1000}
        onResult={onResult}
      />
    ),
  },
  {
    id: 'decide',
    emoji: '⚖️',
    name: { en: 'Snap Judgement', ko: '순간의 판단' },
    hint: { en: 'Banish demons, welcome the holy!', ko: '악마는 추방, 천사는 환영!' },
    render: (tier: Tier, onResult: (s: boolean, n: number) => void) => (
      <QuickDecision
        rounds={6}
        target={tier === 'easy' ? 3 : tier === 'med' ? 4 : 5}
        perItemMs={tier === 'easy' ? 1600 : tier === 'med' ? 1300 : 1100}
        onResult={onResult}
      />
    ),
  },
  {
    id: 'path',
    emoji: '✨',
    name: { en: 'Ember Path', ko: '불씨의 길' },
    hint: { en: 'Trace the path in order!', ko: '순서대로 길을 이어라!' },
    render: (tier: Tier, onResult: (s: boolean, n: number) => void) => (
      <LightPath
        nodeCount={tier === 'easy' ? 4 : tier === 'med' ? 5 : 6}
        timeLimit={tier === 'easy' ? 7 : tier === 'med' ? 6 : 5}
        onResult={onResult}
      />
    ),
  },
  {
    id: 'flip',
    emoji: '🃏',
    name: { en: 'Sinner Pairs', ko: '죄인의 짝' },
    hint: { en: 'Match all the pairs!', ko: '모든 짝을 맞춰라!' },
    render: (tier: Tier, onResult: (s: boolean, n: number) => void) => (
      <MemoryFlip
        pairs={tier === 'hard' ? 4 : 3}
        maxMistakes={tier === 'easy' ? 4 : tier === 'med' ? 3 : 2}
        onResult={onResult}
      />
    ),
  },
];

export default function DemonDuel() {
  const phase = useGameStore((s) => s.phase);
  const player = useGameStore((s) => s.player);
  const turnNumber = useGameStore((s) => s.turnNumber);
  const locale = useLocale((s) => s.locale);

  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [gameIdx, setGameIdx] = useState(0);
  const initedTurnRef = useRef<number | null>(null);

  // Reset + pick a fresh game whenever a new duel begins (rotating by turn).
  useEffect(() => {
    if (phase !== 'demon_duel') { initedTurnRef.current = null; return; }
    if (initedTurnRef.current === turnNumber) return;
    initedTurnRef.current = turnNumber;
    setResolved(false);
    setResult(null);
    setScore(0);
    setGameIdx(((turnNumber - 1) % ROSTER.length + ROSTER.length) % ROSTER.length);
  }, [phase, turnNumber]);

  if (phase !== 'demon_duel') return null;

  const circleId = player?.currentCircleId ?? 9;
  const tier: Tier = circleId >= 7 ? 'hard' : circleId >= 4 ? 'med' : 'easy';
  const game = ROSTER[gameIdx];

  const handleResult = (success: boolean, gameScore: number) => {
    setResult(success);
    setScore(gameScore);
    setResolved(true);
  };

  const handleContinue = () => {
    const s = useGameStore.getState();
    const p = { ...s.player, buffs: [...s.player.buffs] };
    const log = [...s.log];

    // Always advance at least 1 tile (no getting stuck); better play = further.
    const moveAmt = Math.max(1, Math.min(6, score));

    if (result) {
      log.push({ turn: s.turnNumber, message: locale === 'en'
        ? `${game.emoji} ${game.name.en}: cleared! Move ${moveAmt} spaces!`
        : `${game.emoji} ${game.name.ko}: 성공! ${moveAmt}칸 전진!`, type: 'critical' });
      useGameStore.setState({
        player: p,
        dice: [moveAmt, 0], demonDice: null, isDouble: false, doubleCount: 0,
        phase: 'moving',
        log,
      });
    } else {
      // Failure still moves you, but the demon lands a small blow.
      const dmg = circleId >= 7 ? 4 : circleId >= 4 ? 3 : 2;
      p.hp = Math.max(0, p.hp - dmg);
      log.push({ turn: s.turnNumber, message: locale === 'en'
        ? `💢 ${game.name.en}: rough! -${dmg} HP, move ${moveAmt}.`
        : `💢 ${game.name.ko}: 아슬아슬! -${dmg} HP, ${moveAmt}칸 전진.`, type: 'damage' });
      useGameStore.setState({
        player: p,
        dice: [moveAmt, 0], demonDice: null, isDouble: false, doubleCount: 0,
        phase: 'moving',
        shakeScreen: true,
        log,
      });
      setTimeout(() => useGameStore.setState({ shakeScreen: false }), 500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-stone-900 border border-red-700/40 rounded-2xl p-4 w-full max-w-xs" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <div className="text-center mb-3">
            <p className="text-4xl mb-1">{game.emoji}</p>
            <h2 className="text-lg font-bold text-red-400 font-serif">
              {locale === 'en' ? game.name.en : game.name.ko}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {locale === 'en' ? game.hint.en : game.hint.ko}
            </p>
            <p className="text-[10px] text-amber-500/70 mt-0.5">
              {locale === 'en' ? 'Score = spaces moved' : '점수 = 이동 칸 수'}
            </p>
          </div>

          {!resolved ? (
            <div key={`${game.id}-${turnNumber}`}>
              {game.render(tier, handleResult)}
            </div>
          ) : (
            <div className="text-center">
              <p className={`text-xl font-bold mb-2 ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? '✅' : '💢'} {locale === 'en' ? `Score ${score}` : `점수 ${score}`}
              </p>
              <p className="text-sm text-amber-400 mb-2">→ {Math.max(1, Math.min(6, score))} {locale === 'en' ? 'spaces' : '칸 이동'}</p>
              <Button variant="primary" size="lg" onClick={handleContinue} className="w-full min-h-[48px] bg-red-800 hover:bg-red-700">
                {locale === 'en' ? 'Continue ▶' : '계속 ▶'}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
