import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  borderColor: string;
  surface: string;
  mutedClass: string;
  focus: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, borderColor, surface, mutedClass, focus }) => (
  <div className="relative mb-4">
    <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedClass}`} />
    <input
      type="text"
      dir="auto"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title or description"
      aria-label="Search tasks"
      className="w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-[#F2B533]"
      style={{ background: surface, borderColor }}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 ${mutedClass} ${focus}`}
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);