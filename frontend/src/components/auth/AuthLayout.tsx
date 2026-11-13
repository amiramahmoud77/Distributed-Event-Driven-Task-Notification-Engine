import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { palette } from '../dashboard/constants';
import { CIRCLE, Doodle } from '../dashboard/Doodle';
import type { TaskStatus } from '../../types';

interface AuthLayoutProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  children: React.ReactNode;
}

const flow: { title: string; detail: string; status: TaskStatus }[] = [
  { title: 'You add a task', detail: 'It is saved and queued.', status: 'PENDING' },
  { title: 'A worker picks it up', detail: 'It is processed in the background.', status: 'IN_PROGRESS' },
  { title: 'You are notified', detail: 'The result comes back to you.', status: 'COMPLETED' },
];

const Brand: React.FC = () => (
  <div className="flex items-center gap-2.5">
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#F2B533]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={CIRCLE} />
      <path d="M7.8 12.4l2.9 3 5.6-6.4" />
    </svg>
    <span className="text-lg font-semibold tracking-tight">Task Engine</span>
  </div>
);

export const AuthLayout: React.FC<AuthLayoutProps> = ({ isDarkMode, setIsDarkMode, children }) => {
  const t = isDarkMode
    ? {
        page: 'bg-[#101826] text-[#E8ECF4]',
        panel: '#172033',
        border: '#2C3A56',
        muted: 'text-[#8B96AB]',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        page: 'bg-[#EEF2F6] text-[#14213D]',
        panel: '#FFFFFF',
        border: '#D7DEE8',
        muted: 'text-[#5B6578]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const accent = (status: TaskStatus) => (isDarkMode ? palette[status].dark : palette[status].light);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${t.page}`}
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: none; }
        }
        .step { animation: stepIn 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .step { animation: none; } }
      `}</style>

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside
          className="hidden flex-col border-r p-12 lg:flex"
          style={{ background: t.panel, borderColor: t.border }}
        >
          <Brand />

          <div className="my-auto max-w-md">
            <h1
              className="text-[44px] font-semibold leading-[1.05] tracking-[-0.02em]"
              style={{ fontVariationSettings: "'wdth' 85" }}
            >
              Track every task from start to finish.
            </h1>
            <p className={`mt-4 text-lg ${t.muted}`}>
              Add a task, watch it move through its stages, and get notified along the way.
            </p>

            <ol className="mt-10 space-y-6">
              {flow.map((step, index) => {
                const color = accent(step.status);

                return (
                  <li
                    key={step.title}
                    className="step relative flex items-start gap-4"
                    style={{ animationDelay: `${300 + index * 200}ms` }}
                  >
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border"
                      style={{ color, background: `${color}1F`, borderColor: `${color}55` }}
                    >
                      <Doodle kind={step.status} className="h-5 w-5" />
                    </span>

                    {index < flow.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute border-l border-dashed"
                        style={{ left: 19.5, top: 44, height: 16, borderColor: t.border }}
                      />
                    )}

                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className={`text-sm ${t.muted}`}>{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        <main className="flex flex-col px-6 py-6 sm:px-12">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Brand />
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`ml-auto rounded-lg p-2 ${t.ghost} ${focus}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="mx-auto my-auto w-full max-w-sm py-10">{children}</div>
        </main>
      </div>
    </div>
  );
};