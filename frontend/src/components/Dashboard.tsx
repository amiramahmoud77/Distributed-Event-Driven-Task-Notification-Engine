import React, { useEffect, useState } from 'react';
import { Sun, Moon, LogOut, Plus } from 'lucide-react';
import { api } from '../api';
import { CreateTaskModal } from './CreateTaskModal';
import type { Task, TaskPriority, TaskStatus } from '../types';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const statusConfig: Record<TaskStatus, { label: string; light: string; dark: string }> = {
  PENDING: { label: 'Pending', light: 'text-[#9A6700]', dark: 'text-[#F2B533]' },
  IN_PROGRESS: { label: 'In progress', light: 'text-[#2B50AA]', dark: 'text-[#7FA2F5]' },
  COMPLETED: { label: 'Completed', light: 'text-[#2E7D5B]', dark: 'text-[#5CC49A]' },
  FAILED: { label: 'Failed', light: 'text-[#C23B3B]', dark: 'text-[#F07878]' },
};

const priorityLevel: Record<TaskPriority, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const priorityLabel: Record<TaskPriority, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
const stampTilt = [-1.5, 1, -0.5, 1.5, -1];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const PriorityMark: React.FC<{ priority: TaskPriority; isDarkMode: boolean }> = ({ priority, isDarkMode }) => {
  const level = priorityLevel[priority];
  const on = isDarkMode ? 'bg-[#E8ECF4]' : 'bg-[#14213D]';
  const off = isDarkMode ? 'bg-[#26324A]' : 'bg-[#CBD3DF]';

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`w-[5px] rounded-[1px] ${bar <= level ? on : off}`}
            style={{ height: 6 + bar * 4 }}
          />
        ))}
      </span>
      {priorityLabel[priority]}
    </span>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, setIsDarkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);

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

  const countBy = (status: TaskStatus) => tasks.filter((task) => task.status === status).length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const t = isDarkMode
    ? {
        page: 'bg-[#101826] text-[#E8ECF4]',
        strong: 'text-[#E8ECF4]',
        muted: 'text-[#8B96AB]',
        line: 'border-[#26324A]',
        danger: 'text-[#F07878]',
        btn: 'bg-[#E8ECF4] text-[#101826] hover:bg-white',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        page: 'bg-[#EEF2F6] text-[#14213D]',
        strong: 'text-[#14213D]',
        muted: 'text-[#5B6578]',
        line: 'border-[#CBD3DF]',
        danger: 'text-[#C23B3B]',
        btn: 'bg-[#14213D] text-[#EEF2F6] hover:bg-[#1f3159]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const columns = 'md:grid md:grid-cols-[minmax(0,1fr)_110px_110px_120px]';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${t.page}`}
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes stampIn {
          from { opacity: 0; transform: scale(1.4) rotate(var(--tilt)); }
          to { opacity: 1; transform: scale(1) rotate(var(--tilt)); }
        }
        @keyframes flashRow {
          from { background-color: rgba(242, 169, 0, 0.3); }
          to { background-color: transparent; }
        }
        .stamp {
          display: inline-block;
          padding: 2px 10px;
          border: 1.5px solid currentColor;
          outline: 1px solid currentColor;
          outline-offset: 2px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          transform: rotate(var(--tilt));
          animation: stampIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
        }
        .row-flash { animation: flashRow 1.8s ease-out; }
        @media (prefers-reduced-motion: reduce) { .stamp, .row-flash { animation: none; } }
      `}</style>

      <header className={`border-b ${t.line}`}>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">Task Engine</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`rounded-md p-2 ${t.ghost} ${focus}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={onLogout}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${t.ghost} ${focus}`}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl"
              style={{ fontVariationSettings: "'wdth' 85" }}
            >
              {todayLabel}
            </h1>

            <p className={`mt-3 text-lg ${t.muted}`}>
              {isLoading || error ? (
                'Your tasks'
              ) : tasks.length === 0 ? (
                'Nothing queued yet.'
              ) : (
                <>
                  <strong className={`font-semibold tabular-nums ${t.strong}`}>{countBy('PENDING')}</strong> pending,{' '}
                  <strong className={`font-semibold tabular-nums ${t.strong}`}>{countBy('IN_PROGRESS')}</strong> in progress,{' '}
                  <strong className={`font-semibold tabular-nums ${t.strong}`}>{countBy('COMPLETED')}</strong> completed
                  {countBy('FAILED') > 0 && (
                    <>
                      , <strong className={`font-semibold tabular-nums ${t.strong}`}>{countBy('FAILED')}</strong> failed
                    </>
                  )}
                  .
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${t.btn} ${focus}`}
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>

        <section className="mt-12">
          {error && (
            <div className="py-10">
              <p className={`font-medium ${t.danger}`}>Couldn’t load your tasks: {error}</p>
              <p className={`mt-1 text-sm ${t.muted}`}>Check that the API is running, then reload the page.</p>
            </div>
          )}

          {isLoading && <p className={`py-10 ${t.muted}`}>Loading tasks…</p>}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="py-10">
              <p className="text-xl font-medium">No tasks yet</p>
              <p className={`mt-1 ${t.muted}`}>Use New task to add your first one. It will show up here with its status.</p>
            </div>
          )}

          {!isLoading && !error && tasks.length > 0 && (
            <>
              <div className={`hidden border-b pb-2 text-sm ${columns} ${t.line} ${t.muted}`}>
                <span>Task</span>
                <span>Priority</span>
                <span>Due</span>
                <span className="justify-self-end">Status</span>
              </div>

              <ul>
                {tasks.map((task, index) => {
                  const status = statusConfig[task.status];
                  const overdue =
                    !!task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) < startOfToday;

                  return (
                    <li
                      key={task._id}
                      className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-dashed py-4 ${columns} ${t.line} ${
                        task._id === newId ? 'row-flash' : ''
                      }`}
                    >
                      <div className="min-w-0 basis-full md:basis-auto">
                        <p className="truncate text-[17px] font-medium">{task.title}</p>
                        {task.description && (
                          <p className={`mt-0.5 truncate text-sm ${t.muted}`}>{task.description}</p>
                        )}
                      </div>

                      <div>
                        <PriorityMark priority={task.priority} isDarkMode={isDarkMode} />
                      </div>

                      <div className="text-sm">
                        {task.dueDate ? (
                          <span className={overdue ? `font-medium ${t.danger}` : ''}>
                            {overdue ? 'Overdue ' : ''}
                            {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span className={t.muted}>No date</span>
                        )}
                      </div>

                      <div className="px-1 md:justify-self-end">
                        <span
                          className={`stamp ${isDarkMode ? status.dark : status.light}`}
                          style={
                            {
                              '--tilt': `${stampTilt[index % stampTilt.length]}deg`,
                              animationDelay: `${index * 70}ms`,
                            } as React.CSSProperties
                          }
                        >
                          {status.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
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