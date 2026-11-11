import React from 'react';
import { palette } from './constants';
import { Doodle } from './Doodle';
import { useCountUp } from './useCountUp';
import type { TaskStatus } from '../../types';

interface StatCardProps {
  status: TaskStatus;
  value: number;
  caption: string;
  color: string;
  radius: string;
  delay: number;
  loading: boolean;
  mutedClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ status, value, caption, color, radius, delay, loading, mutedClass }) => {
  const shown = useCountUp(loading ? 0 : value);

  return (
    <div
      className="pop p-5"
      style={{
        background: `${color}1F`,
        border: `1.5px solid ${color}55`,
        borderRadius: radius,
        color,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">{palette[status].label}</span>
        <Doodle kind={status} className="h-7 w-7 -rotate-6" />
      </div>
      <p className="mt-3 text-[52px] font-bold leading-none tabular-nums">{shown}</p>
      <p className={`mt-2 text-sm ${mutedClass}`}>{caption}</p>
    </div>
  );
};