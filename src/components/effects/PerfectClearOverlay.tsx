'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';

export default function PerfectClearOverlay() {
  const showPerfectClear = useGameStore((s) => s.showPerfectClear);
  const comboCount = useGameStore((s) => s.comboCount);
  const showCombo = useGameStore((s) => s.showCombo);
  const [visible, setVisible] = useState(false);
  const [comboVisible, setComboVisible] = useState(false);

  useEffect(() => {
    if (showPerfectClear) {
      // 스토어 트리거 발생 시 2초간 오버레이 표시 — 타이머 구동 부작용.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showPerfectClear]);

  useEffect(() => {
    if (showCombo && comboCount >= 2) {
      // 콤보 트리거 발생 시 1.5초간 표시 — 타이머 구동 부작용.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComboVisible(true);
      const t = setTimeout(() => setComboVisible(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showCombo, comboCount]);

  const label = (() => {
    switch (showPerfectClear) {
      case 'perfect': return 'PERFECT';
      case 'flawless': return 'FLAWLESS';
      case 'divine': return 'DIVINE';
      default: return '';
    }
  })();

  const color = (() => {
    switch (showPerfectClear) {
      case 'perfect': return 'text-emerald-400';
      case 'flawless': return 'text-amber-400';
      case 'divine': return 'text-purple-400';
      default: return 'text-white';
    }
  })();

  return (
    <>
      <AnimatePresence>
        {visible && label && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`text-5xl font-black font-serif ${color} drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}>
              ✨ {label} ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {comboVisible && (
          <motion.div
            className="fixed top-20 left-0 right-0 z-[60] flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-stone-900/80 border border-amber-500/50 rounded-full px-4 py-1 text-amber-400 font-bold text-lg">
              🔥 {comboCount}x COMBO
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
