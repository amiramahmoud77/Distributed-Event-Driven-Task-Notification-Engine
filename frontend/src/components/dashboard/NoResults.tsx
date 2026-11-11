import React from 'react';
import { Inbox } from 'lucide-react';
import type { StatusFilter } from './filters';

const messages: Record<StatusFilter, string> = {
  ALL: 'No tasks to show.',
  PENDING: 'Nothing is pending.',
  IN_PROGRESS: 'Nothing is in progress.',
  COMPLETED: 'Nothing is completed yet.',
  FAILED: 'Nothing has failed.',
};

interface NoResultsProps {
  filter: StatusFilter;
  onClear: () => void;
  borderColor: string;
  mutedClass: string;
  focus: string;
}

export const NoResults: React.FC<NoResultsProps> = ({ filter, onClear, borderColor, mutedClass, focus }) => (
  <div
    className="flex flex-col items-center border border-dashed px-6 py-12 text-center"
    style={{ borderColor, borderRadius: 20 }}
  >
    <Inbox className={`mb-3 h-9 w-9 ${mutedClass}`} />
    <p className="text-lg font-medium">{messages[filter]}</p>
    <button
      type="button"
      onClick={onClear}
      className={`mt-3 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#F2B533] underline-offset-4 hover:underline ${focus}`}
    >
      Show all tasks
    </button>
  </div>
);