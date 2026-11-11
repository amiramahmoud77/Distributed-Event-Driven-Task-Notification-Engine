import React from 'react';
import type { TaskStatus } from '../../types';

export const CIRCLE = 'M12 3.2c4.8-.3 8.9 3.6 8.8 8.5-.1 4.9-4 8.6-8.8 8.4-4.9-.2-8.5-4-8.3-8.8C3.9 6.9 7.5 3.4 12 3.2Z';

export const Doodle: React.FC<{ kind: TaskStatus; className?: string }> = ({ kind, className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {kind === 'PENDING' && (
      <>
        <path d={CIRCLE} />
        <path d="M12 7.5v4.6l3 1.8" />
      </>
    )}
    {kind === 'IN_PROGRESS' && (
      <>
        <path d="M20.2 12.4a8.2 8.2 0 1 1-2.7-6.3" />
        <path d="M20.6 3.6v4.4h-4.4" />
      </>
    )}
    {kind === 'COMPLETED' && (
      <>
        <path d={CIRCLE} />
        <path d="M7.8 12.4l2.9 3 5.6-6.4" />
      </>
    )}
    {kind === 'FAILED' && (
      <>
        <path d={CIRCLE} />
        <path d="M9 9l6 6M15 9l-6 6" />
      </>
    )}
  </svg>
);