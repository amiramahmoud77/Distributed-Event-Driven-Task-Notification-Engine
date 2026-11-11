import React, { useEffect, useState } from 'react';
import { Sun, Moon, LogOut, Plus, Inbox, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { CreateTaskModal } from './CreateTaskModal';
import {
  nextAction,
  nextStatus,
  palette,
  priorityColor,
  radii,
} from './dashboard/constants';
import { CIRCLE, Doodle } from './dashboard/Doodle';
import { formatDate } from './dashboard/format';
import { PriorityMark } from './dashboard/PriorityMark';
import { ProgressRing } from './dashboard/ProgressRing';
import { StatCard } from './dashboard/StatCard';
import type { Task, TaskPriority, TaskStatus } from '../types';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, setIsDarkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const result = await api('/api/tasks');
        setTasks(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setNewId(task._id);
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    const snapshot = tasks;
    setActionError(null);
    setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status } : item)));

    try {
      await api(`/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err: any) {
      setTasks(snapshot);
      setActionError(`Couldn’t update “${task.title}”. ${err.message}`);
    }
  };

  const toggleSelected = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const countBy = (status: TaskStatus) => tasks.filter((task) => task.status === status).length;
  const accent = (status: TaskStatus) => (isDarkMode ? palette[status].dark : palette[status].light);
  const priorityAccent = (priority: TaskPriority) => (isDarkMode ? priorityColor[priority].dark : priorityColor[priority].light);

  const openCount = countBy('PENDING') + countBy('IN_PROGRESS');
  const percent = tasks.length ? Math.round((countBy('COMPLETED') / tasks.length) * 100) : 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const dayMonth = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  const summary =
    isLoading || error
      ? `${greeting}.`
      : tasks.length === 0
      ? `${greeting}. Nothing queued yet.`
      : openCount === 0
      ? `${greeting}. Everything is done.`
      : `${greeting}. ${openCount} ${openCount === 1 ? 'task is' : 'tasks are'} still open.`;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const t = isDarkMode
    ? {
        page: 'bg-[#101826] text-[#E8ECF4]',
        surface: '#172033',
        border: '#2C3A56',
        track: '#2C3A56',
        muted: 'text-[#8B96AB]',
        danger: 'text-[#F07878]',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        page: 'bg-[#EEF2F6] text-[#14213D]',
        surface: '#FFFFFF',
        border: '#D7DEE8',
        track: '#D7DEE8',
        muted: 'text-[#5B6578]',
        danger: 'text-[#C23B3B]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const gridCols = countBy('FAILED') > 0 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${t.page}`}
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(22px) scale(0.94); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes badgeIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes glow {
          from { box-shadow: 0 0 0 0 rgba(242, 181, 51, 0.7); }
          to { box-shadow: 0 0 0 16px rgba(242, 181, 51, 0); }
        }

        .pop { animation: popIn 0.55s cubic-bezier(0.2, 0.9, 0.3, 1) backwards; }
        .fresh { animation: popIn 0.55s cubic-bezier(0.2, 0.9, 0.3, 1) backwards, glow 1.2s ease-out 2; }
        .squiggle { stroke-dasharray: 1; stroke-dashoffset: 1; animation: drawLine 0.9s 0.3s ease-out forwards; }
        .badge { animation: badgeIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; }

        @media (prefers-reduced-motion: reduce) {
          .pop, .fresh, .badge { animation: none; }
          .squiggle { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <header className="border-b" style={{ borderColor: t.border }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#F2B533]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={CIRCLE} />
              <path d="M7.8 12.4l2.9 3 5.6-6.4" />
            </svg>
            <span className="text-lg font-semibold tracking-tight">Task Engine</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`rounded-lg p-2 ${t.ghost} ${focus}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button onClick={onLogout} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${t.ghost} ${focus}`}>
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 pb-24 pt-10">
        <section
          className="pop flex flex-wrap items-center justify-between gap-8 border p-7"
          style={{ background: t.surface, borderColor: t.border, borderRadius: '32px 28px 34px 26px' }}
        >
          <div>
            <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl" style={{ fontVariationSettings: "'wdth' 85" }}>
              {weekday} {dayMonth}
            </h1>
            <svg width="300" height="12" viewBox="0 0 300 12" fill="none" className="mt-2" aria-hidden="true">
              <path
                className="squiggle"
                pathLength="1"
                d="M2 8c14-9 24 6 38-1s24-6 38 0 26 7 40 0 24-7 38-1 26 6 40 0 24-6 38-1 24 5 26 3"
                stroke="#F2B533"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className={`mt-4 max-w-md text-lg ${t.muted}`}>{summary}</p>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F2B533] px-5 py-3 text-sm font-semibold text-[#101826] transition-all hover:scale-105 hover:bg-[#F7C455] ${focus}`}
            >
              <Plus className="h-4 w-4" />
              New task
            </button>
          </div>

          <ProgressRing percent={percent} color={accent('COMPLETED')} track={t.track} loading={isLoading || !!error} />
        </section>

        <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
          <StatCard status="PENDING" value={countBy('PENDING')} caption="waiting for you" color={accent('PENDING')} radius={radii[0]} delay={120} loading={isLoading} mutedClass={t.muted} />
          <StatCard status="IN_PROGRESS" value={countBy('IN_PROGRESS')} caption="being worked on" color={accent('IN_PROGRESS')} radius={radii[1]} delay={200} loading={isLoading} mutedClass={t.muted} />
          <StatCard status="COMPLETED" value={countBy('COMPLETED')} caption="finished" color={accent('COMPLETED')} radius={radii[2]} delay={280} loading={isLoading} mutedClass={t.muted} />
          {countBy('FAILED') > 0 && (
            <StatCard status="FAILED" value={countBy('FAILED')} caption="need a look" color={accent('FAILED')} radius={radii[3]} delay={360} loading={isLoading} mutedClass={t.muted} />
          )}
        </div>

        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Your tasks</h2>
            {!isLoading && !error && <span className={`text-sm ${t.muted}`}>{tasks.length} in total</span>}
          </div>

          {actionError && (
            <div
              role="alert"
              className="mb-4 flex items-start justify-between gap-4 border p-4"
              style={{ background: '#F0787814', borderColor: '#F0787855', borderRadius: 16 }}
            >
              <p className={`text-sm font-medium ${t.danger}`}>{actionError}</p>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className={`flex-shrink-0 text-sm font-medium ${t.ghost} ${focus}`}
              >
                Dismiss
              </button>
            </div>
          )}

          {error && (
            <div className="border p-6" style={{ background: '#F0787814', borderColor: '#F0787855', borderRadius: 20 }}>
              <p className={`font-medium ${t.danger}`}>Couldn’t load your tasks: {error}</p>
              <p className={`mt-1 text-sm ${t.muted}`}>Check that the API is running, then reload the page.</p>
            </div>
          )}

          {isLoading && <p className={t.muted}>Loading tasks…</p>}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="flex flex-col items-center border border-dashed px-6 py-14 text-center" style={{ borderColor: t.border, borderRadius: 20 }}>
              <Inbox className={`mb-3 h-10 w-10 ${t.muted}`} />
              <p className="text-xl font-medium">Nothing here yet</p>
              <p className={`mt-1 ${t.muted}`}>Press New task to add the first one.</p>
            </div>
          )}

          {!isLoading && !error && tasks.length > 0 && (
            <ul className="space-y-3">
              {tasks.map((task, index) => {
                const statusColor = accent(task.status);
                const color = priorityAccent(task.priority);
                const isSelected = selectedId === task._id;
                const overdue = !!task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) < startOfToday;
                const upcoming = nextStatus[task.status];

                return (
                  <li key={task._id}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={() => toggleSelected(task._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSelected(task._id);
                        }
                      }}
                      className={`pop relative cursor-pointer overflow-hidden border py-5 pl-7 pr-5 outline-none transition-[box-shadow,border-color,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900] ${
                        task._id === newId ? 'fresh' : ''
                      }`}
                      style={{
                        background: isSelected ? `${color}12` : t.surface,
                        borderColor: isSelected ? color : t.border,
                        borderRadius: 20,
                        boxShadow: isSelected ? `0 0 0 1px ${color}, 0 0 26px ${color}45` : 'none',
                        animationDelay: `${400 + index * 70}ms`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[5px]"
                        style={{ background: color, opacity: 0.85 }}
                      />

                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3">
                        <div className="min-w-0">
                          <p dir="auto" style={{ textAlign: 'left' }} className="truncate text-lg font-medium">
                            {task.title}
                          </p>
                          {task.description && (
                            <p dir="auto" style={{ textAlign: 'left' }} className={`mt-0.5 truncate text-sm ${t.muted}`}>
                              {task.description}
                            </p>
                          )}
                        </div>

                        <span
                          className="badge inline-flex h-7 items-center gap-1.5 justify-self-end rounded-full px-3 text-[13px] font-semibold"
                          style={{
                            color: statusColor,
                            background: `${statusColor}1F`,
                            border: `1px solid ${statusColor}55`,
                            animationDelay: `${600 + index * 70}ms`,
                          }}
                        >
                          <Doodle kind={task.status} className="h-3.5 w-3.5" />
                          {palette[task.status].label}
                        </span>

                        <div className="col-span-2 flex flex-wrap items-center gap-3">
                          <PriorityMark priority={task.priority} color={color} isDarkMode={isDarkMode} />
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs ${overdue ? `font-medium ${t.danger}` : t.muted}`}
                            style={{ background: overdue ? '#F0787826' : isDarkMode ? '#FFFFFF10' : '#14213D0F' }}
                          >
                            {task.dueDate ? `${overdue ? 'Overdue, ' : 'Due '}${formatDate(task.dueDate)}` : 'No due date'}
                          </span>

                          {upcoming && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task, upcoming);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-[filter] hover:brightness-125 ${focus}`}
                              style={{
                                color: accent(upcoming),
                                background: `${accent(upcoming)}1F`,
                                border: `1px solid ${accent(upcoming)}55`,
                              }}
                            >
                              {nextAction[task.status]}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {isModalOpen && (
        <CreateTaskModal
          isDarkMode={isDarkMode}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};