import React from 'react';
import { priorityLabel, priorityLevel } from './constants';
import type { TaskPriority } from '../../types';

interface PriorityMarkProps {
  priority: TaskPriority;
  color: string;
  isDarkMode: boolean;
}

export const PriorityMark: React.FC<PriorityMarkProps> = ({ priority, color, isDarkMode }) => {
  const level = priorityLevel[priority];
  const off = isDarkMode ? '#2C3A56' : '#CBD3DF';

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color }}>
      <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className="w-[5px] rounded-[2px]"
            style={{ height: 6 + bar * 4, background: bar <= level ? color : off }}
          />
        ))}
      </span>
      {priorityLabel[priority]}
    </span>
  );
};