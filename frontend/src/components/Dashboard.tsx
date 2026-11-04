import React, { useEffect, useState } from 'react';
import {
  Sun,
  Moon,
  LogOut,
  Activity,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Inbox,
  Plus,
} from 'lucide-react';
import { api } from '../api';
import { CreateTaskModal } from './CreateTaskModal';
import type { Task, TaskStatus } from '../types';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; style: string }> = {
  PENDING: { label: 'Pending', icon: Clock, style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  IN_PROGRESS: { label: 'In Progress', icon: Loader2, style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  FAILED: { label: 'Failed', icon: XCircle, style: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const priorityStyle: Record<string, string> = {
  LOW: 'text-zinc-400',
  MEDIUM: 'text-amber-500',
  HIGH: 'text-red-500',
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, setIsDarkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  const countBy = (status: TaskStatus) => tasks.filter((task) => task.status === status).length;

  const card = isDarkMode
    ? 'bg-zinc-900/60 border-zinc-800 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 shadow-sm backdrop-blur-xl';

  const stats = [
    { label: 'Pending', value: countBy('PENDING'), icon: Clock, color: 'text-amber-500', glow: 'bg-amber-500/10' },
    { label: 'In Progress', value: countBy('IN_PROGRESS'), icon: Loader2, color: 'text-indigo-400', glow: 'bg-indigo-500/10' },
    { label: 'Completed', value: countBy('COMPLETED'), icon: CheckCircle2, color: 'text-emerald-500', glow: 'bg-emerald-500/10' },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -30px); } }
        .fade-up { animation: fadeUp 0.55s ease both; }
        .blob { animation: float 14s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fade-up, .blob { animation: none; } }
      `}</style>

      <div className="blob pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="blob pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" style={{ animationDelay: '-7s' }} />

      <header className={`relative z-10 flex items-center justify-between border-b px-8 py-4 backdrop-blur-xl ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-slate-200 bg-white/70'}`}>
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/30">
            TE
          </div>
          <span className="text-xl font-bold tracking-tight">Task Engine</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded-xl border p-2.5 transition-all duration-200 hover:scale-105 ${isDarkMode ? 'border-zinc-800 bg-zinc-900 text-amber-400' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-all duration-200 hover:scale-105 hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 p-8">
        <div className="fade-up flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Live view of your tasks and pipeline status.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`fade-up rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${card}`} style={{ animationDelay: '60ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">System Status</span>
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <h3 className="text-2xl font-bold">Operational</h3>
            </div>
            <p className="mt-1 text-xs text-zinc-500">All pipelines running smoothly</p>
          </div>

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`fade-up rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${card}`}
              style={{ animationDelay: `${(index + 2) * 60}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                <div className={`rounded-lg p-2 ${stat.glow}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              {isLoading ? (
                <div className={`h-8 w-16 animate-pulse rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-200'}`} />
              ) : (
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              )}
              <p className="mt-1 text-xs text-zinc-500">{error ?? 'tasks'}</p>
            </div>
          ))}
        </div>

        <section className={`fade-up rounded-2xl border ${card}`} style={{ animationDelay: '300ms' }}>
          <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            {!isLoading && !error && (
              <span className="text-xs text-zinc-500">{tasks.length} total</span>
            )}
          </div>

          {error && (
            <div className="m-6 flex items-center space-x-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-500">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-14 animate-pulse rounded-xl ${isDarkMode ? 'bg-zinc-800/70' : 'bg-slate-200/70'}`} />
              ))}
            </div>
          )}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className={`mb-4 rounded-2xl p-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <Inbox className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="font-medium">No tasks yet</p>
              <p className="mt-1 text-sm text-zinc-500">Tasks you create will show up here.</p>
            </div>
          )}

          {!isLoading && !error && tasks.length > 0 && (
            <ul className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-slate-200'}`}>
              {tasks.map((task, index) => {
                const status = statusConfig[task.status];
                const StatusIcon = status.icon;
                return (
                  <li
                    key={task._id}
                    className={`fade-up flex items-center justify-between px-6 py-4 transition-colors ${isDarkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{task.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        <span className={priorityStyle[task.priority]}>{task.priority}</span>
                        {' · '}
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`ml-4 inline-flex flex-shrink-0 items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.style}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{status.label}</span>
                    </span>
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