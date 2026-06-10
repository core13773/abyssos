'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  rounds: number;        // number of sweeps to attempt
  targetHits: number;    // hits needed to succeed
  sweepMs?: number;      // ms for the marker to cross the bar once
  zoneWidth?: number;    // green-zone width as % of the bar
  onResult: (success: boolean, score: number) => void;
}

// ── TapRunner ─────────────────────────────────────────────────────────────
// A marker sweeps back and forth across a bar. Tap when it is inside the green
// zone. Each round the zone shrinks slightly. Hits = score. Pure reflex/timing.
export default function TapRunner({ rounds, targetHits, sweepMs = 1400, zoneWidth = 26, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [pos, setPos] = useState(50);         // marker position 0..100
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null);
  const [zoneStart, setZoneStart] = useState(50 - zoneWidth / 2);

  const posRef = useRef(50);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const zoneRef = useRef(zoneStart);
  const hitsRef = useRef(0);
  const roundRef = useRef(0);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const newZone = useCallback((r: number) => {
    // Zone shrinks a touch each round, position randomised.
    const w = Math.max(12, zoneWidth - r * 2);
    const start = 8 + Math.random() * (84 - w);
    zoneRef.current = start;
    setZoneStart(start);
    return w;
  }, [zoneWidth]);

  const [zoneW, setZoneW] = useState(zoneWidth);

  const startGame = useCallback(() => {
    setPhase('playing');
    hitsRef.current = 0; roundRef.current = 0;
    setHits(0); setRound(0);
    setZoneW(newZone(0));
    lockRef.current = false;

    const start = Date.now();
    rafRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) % sweepMs;
      const t = elapsed / sweepMs;                 // 0..1
      const tri = t < 0.5 ? t * 2 : 2 - t * 2;     // triangle wave 0..1..0
      const p = 4 + tri * 92;
      posRef.current = p;
      setPos(p);
    }, 24);
  }, [newZone, sweepMs]);

  useEffect(() => {
    return () => { if (rafRef.current) clearInterval(rafRef.current); };
  }, []);

  const finish = useCallback(() => {
    if (rafRef.current) clearInterval(rafRef.current);
    setPhase('done');
    const ok = hitsRef.current >= targetHits;
    setTimeout(() => onResultRef.current(ok, hitsRef.current), 450);
  }, [targetHits]);

  const handleTap = useCallback(() => {
    if (phase !== 'playing' || lockRef.current) return;
    lockRef.current = true;
    const p = posRef.current;
    const inZone = p >= zoneRef.current && p <= zoneRef.current + zoneW;
    if (inZone) { hitsRef.current += 1; setHits(hitsRef.current); setFlash('hit'); }
    else setFlash('miss');

    roundRef.current += 1;
    setRound(roundRef.current);
    setTimeout(() => {
      setFlash(null);
      if (roundRef.current >= rounds) { finish(); return; }
      setZoneW(newZone(roundRef.current));
      lockRef.current = false;
    }, 260);
  }, [phase, zoneW, rounds, newZone, finish]);

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en'
              ? `Stop the marker in the green zone! (${targetHits}/${rounds})`
              : `초록 구간에서 멈춰라! (${targetHits}/${rounds})`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg active:scale-95 transition-transform border border-amber-400/50">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full" onClick={handleTap}>
          <div className="flex justify-between text-[10px] text-stone-500 mb-1">
            <span>{locale === 'en' ? 'Round' : '라운드'} {round}/{rounds}</span>
            <span className="text-amber-400">✦ {hits}/{targetHits}</span>
          </div>
          <div className="relative w-full h-12 bg-stone-800 rounded-xl overflow-hidden border border-stone-700">
            {/* green zone */}
            <div className="absolute top-0 bottom-0 bg-emerald-600/40 border-x-2 border-emerald-400"
              style={{ left: `${zoneStart}%`, width: `${zoneW}%` }} />
            {/* marker */}
            <div className="absolute top-0 bottom-0 w-1.5 bg-amber-300 shadow-[0_0_8px] shadow-amber-300"
              style={{ left: `${pos}%`, transform: 'translateX(-50%)' }} />
            {flash && (
              <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${flash === 'hit' ? 'text-emerald-300' : 'text-red-400'}`}>
                {flash === 'hit' ? '✓' : '✗'}
              </div>
            )}
          </div>
          <p className="text-center text-xs text-stone-500 mt-2 animate-pulse">
            {locale === 'en' ? 'TAP to stop!' : '탭하여 멈춰라!'}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <p className={`text-lg font-bold ${hits >= targetHits ? 'text-emerald-400' : 'text-red-400'}`}>
          {hits >= targetHits
            ? (locale === 'en' ? `✅ ${hits} hits!` : `✅ ${hits}회 명중!`)
            : (locale === 'en' ? `❌ ${hits}/${targetHits}` : `❌ ${hits}/${targetHits}`)}
        </p>
      )}
    </div>
  );
}
