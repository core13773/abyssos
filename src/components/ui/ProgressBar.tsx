'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'green' | 'yellow' | 'red' | 'purple' | 'amber';
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
};

export default function ProgressBar({
  value,
  max,
  label,
  color = 'green',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  // Color based on percentage
  const autoColor =
    pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-yellow-500' : 'bg-red-500';
  const barColor = color === 'green' ? autoColor : colorMap[color] || autoColor;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-stone-400 mb-1">
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className={`w-full bg-stone-800 rounded-full ${height} overflow-hidden`}>
        <div
          className={`transition-all duration-500 ease-out ${barColor} ${height} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
