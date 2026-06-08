'use client';

import { motion } from 'framer-motion';

interface DiceFaceProps {
  value: number;
  size?: number;
  rolling?: boolean;
}

// Dot positions for a standard D6 face
const dotPositions: Record<number, { cx: number; cy: number }[]> = {
  1: [{ cx: 50, cy: 50 }],
  2: [
    { cx: 25, cy: 25 },
    { cx: 75, cy: 75 },
  ],
  3: [
    { cx: 25, cy: 25 },
    { cx: 50, cy: 50 },
    { cx: 75, cy: 75 },
  ],
  4: [
    { cx: 25, cy: 25 },
    { cx: 75, cy: 25 },
    { cx: 25, cy: 75 },
    { cx: 75, cy: 75 },
  ],
  5: [
    { cx: 25, cy: 25 },
    { cx: 75, cy: 25 },
    { cx: 50, cy: 50 },
    { cx: 25, cy: 75 },
    { cx: 75, cy: 75 },
  ],
  6: [
    { cx: 25, cy: 20 },
    { cx: 75, cy: 20 },
    { cx: 25, cy: 50 },
    { cx: 75, cy: 50 },
    { cx: 25, cy: 80 },
    { cx: 75, cy: 80 },
  ],
};

export default function DiceFace({ value, size = 64, rolling = false }: DiceFaceProps) {
  const dots = dotPositions[Math.min(6, Math.max(1, value))] || dotPositions[1];

  return (
    <motion.div
      animate={
        rolling
          ? {
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
      className="relative"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Die body */}
        <rect
          x={2}
          y={2}
          width={96}
          height={96}
          rx={16}
          ry={16}
          fill="#1c1917"
          stroke="#57534e"
          strokeWidth={3}
        />

        {/* Dots */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={8}
            fill="#fbbf24"
          />
        ))}
      </svg>
    </motion.div>
  );
}
