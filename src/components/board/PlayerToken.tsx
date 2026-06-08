'use client';

import type { Player } from '@/types/game';

interface PlayerTokenProps {
  player: Player;
  x: number;
  y: number;
  isCurrentPlayer: boolean;
}

export default function PlayerToken({ player, x, y, isCurrentPlayer }: PlayerTokenProps) {
  const fill = '#ffd700'; // gold
  const stroke = '#fff';
  const radius = 14;

  return (
    <g>
      {/* Outer glow (pulsing) */}
      {isCurrentPlayer && (
        <circle
          cx={x}
          cy={y}
          r={radius + 8}
          fill="none"
          stroke="#ffd700"
          strokeWidth={2.5}
          opacity={0.3}
          style={{
            animation: 'pulse-ring 1.2s ease-in-out infinite',
          }}
        />
      )}

      {/* Secondary glow */}
      {isCurrentPlayer && (
        <circle
          cx={x}
          cy={y}
          r={radius + 14}
          fill="none"
          stroke="#fff"
          strokeWidth={1}
          opacity={0.15}
          style={{
            animation: 'pulse-ring 1.8s ease-in-out infinite',
          }}
        />
      )}

      {/* Shadow */}
      <circle cx={x + 1.5} cy={y + 2} r={radius} fill="#000" opacity={0.5} />

      {/* Player token body */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={3}
      />

      {/* Inner highlight */}
      <circle
        cx={x}
        cy={y}
        r={radius - 3}
        fill="none"
        stroke="#fff"
        strokeWidth={0.5}
        opacity={0.3}
      />

      {/* Player initial */}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1a1a2e"
        fontSize={13}
        fontWeight="bold"
        fontFamily="serif"
        style={{ pointerEvents: 'none' }}
      >
        {player.name.charAt(0)}
      </text>

      {/* HP bar background */}
      <rect
        x={x - 14}
        y={y - 26}
        width={28}
        height={5}
        rx={2.5}
        fill="#1a1a2e"
        stroke="#3f3f46"
        strokeWidth={0.5}
      />

      {/* HP bar fill */}
      <rect
        x={x - 14}
        y={y - 26}
        width={Math.max(0, (player.hp / player.maxHp) * 28)}
        height={5}
        rx={2.5}
        fill={player.hp > 50 ? '#22c55e' : player.hp > 25 ? '#eab308' : '#ef4444'}
        stroke="none"
        style={{ transition: 'width 0.5s ease' }}
      />

      {/* HP text (tiny, shown on hover via title) */}
      <title>
        {player.name}{'\n'}
        HP: {player.hp}/{player.maxHp}{'\n'}
        Circle {player.currentCircleId}
      </title>
    </g>
  );
}
