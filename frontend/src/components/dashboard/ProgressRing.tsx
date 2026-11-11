import React from 'react';
import { useCountUp } from './useCountUp';

interface ProgressRingProps {
  percent: number;
  color: string;
  track: string;
  loading: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ percent, color, track, loading }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const shown = useCountUp(loading ? 0 : percent, 1100);

  return (
    <div className="relative h-32 w-32 flex-shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke={track} strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - (loading ? 0 : percent) / 100)}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.3, 0.7, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums">{shown}%</span>
        <span className="text-xs opacity-70">done</span>
      </div>
    </div>
  );
};