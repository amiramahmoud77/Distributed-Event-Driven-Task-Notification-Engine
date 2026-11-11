import React from 'react';
import { palette } from './constants';
import { countFor, filterOptions } from './filters';
import type { StatusFilter } from './filters';
import type { Task } from '../../types';

interface FilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  tasks: Task[];
  isDarkMode: boolean;
  borderColor: string;
  mutedClass: string;
  focus: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  value,
  onChange,
  tasks,
  isDarkMode,
  borderColor,
  mutedClass,
  focus,
}) => {
  const neutral = isDarkMode ? '#E8ECF4' : '#14213D';
  const colorFor = (option: StatusFilter) =>
    option === 'ALL' ? neutral : isDarkMode ? palette[option].dark : palette[option].light;

  // The Failed button only appears when there is something to show.
  const options = filterOptions.filter(
    (option) => option.value !== 'FAILED' || value === 'FAILED' || countFor(tasks, 'FAILED') > 0
  );

  return (
    <div role="group" aria-label="Filter tasks by status" className="mb-5 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option.value;
        const color = colorFor(option.value);

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active ? '' : mutedClass
            } ${focus}`}
            style={{
              color: active ? color : undefined,
              background: active ? `${color}1F` : 'transparent',
              borderColor: active ? `${color}88` : borderColor,
            }}
          >
            {option.label}
            <span className="tabular-nums opacity-70">{countFor(tasks, option.value)}</span>
          </button>
        );
      })}
    </div>
  );
};