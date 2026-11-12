import React from 'react';
import { sortOptions } from './sort';
import type { SortKey } from './sort';

interface SortSelectProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
  isDarkMode: boolean;
  borderColor: string;
  surface: string;
  mutedClass: string;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange, isDarkMode, borderColor, surface, mutedClass }) => (
  <label className="flex items-center gap-2 text-sm">
    <span className={mutedClass}>Sort by</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="rounded-lg border py-1.5 pl-3 pr-8 text-sm outline-none transition-colors focus:border-[#F2B533]"
      style={{ background: surface, borderColor, color: 'inherit', colorScheme: isDarkMode ? 'dark' : 'light' }}
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);