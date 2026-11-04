import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api';
import type { Task, TaskPriority } from '../types';

interface CreateTaskModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Low', color: '#7FA2F5' },
  { value: 'MEDIUM', label: 'Medium', color: '#F2B533' },
  { value: 'HIGH', label: 'High', color: '#F07878' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isDarkMode, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const result = await api('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: description || undefined,
          priority,
          dueDate: dueDate || undefined,
        }),
      });
      onCreated(result.data);
      onClose();
    } catch (err: any) {
      setError(`Couldn’t create the task. ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const t = isDarkMode
    ? {
        panel: 'bg-[#172033] border-[#2C3A56] text-[#E8ECF4]',
        field: 'bg-[#101826] border-[#2C3A56] text-[#E8ECF4] placeholder:text-[#8B96AB] focus:border-[#F2B533]',
        muted: 'text-[#8B96AB]',
        danger: 'text-[#F07878]',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
        seg: 'border-[#2C3A56] text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        panel: 'bg-white border-[#D7DEE8] text-[#14213D]',
        field: 'bg-[#F6F8FB] border-[#D7DEE8] text-[#14213D] placeholder:text-[#8B93A5] focus:border-[#14213D]',
        muted: 'text-[#5B6578]',
        danger: 'text-[#C23B3B]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
        seg: 'border-[#D7DEE8] text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const field = `w-full rounded-xl border px-3.5 py-2.5 text-[15px] outline-none transition-colors ${t.field}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101826]/70 p-4"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.94) rotate(-1deg); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.01) rotate(0.3deg); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        .modal-in { animation: modalIn 0.38s cubic-bezier(0.2, 0.9, 0.3, 1) both; }
        .modal-squiggle { stroke-dasharray: 1; stroke-dashoffset: 1; animation: drawLine 0.7s 0.2s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .modal-in { animation: none; }
          .modal-squiggle { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
        className={`modal-in w-full max-w-md border p-6 ${t.panel}`}
        style={{ borderRadius: '28px 24px 30px 26px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="new-task-title" className="text-2xl font-semibold tracking-tight">New task</h2>
            <svg width="110" height="10" viewBox="0 0 110 10" fill="none" className="mt-1" aria-hidden="true">
              <path
                className="modal-squiggle"
                pathLength="1"
                d="M2 6c8-6 14 5 22-1s14-4 22 0 14 6 22 0 14-4 22 0 12 3 18 1"
                stroke="#F2B533"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <button onClick={onClose} aria-label="Close" className={`rounded-lg p-1.5 ${t.ghost} ${focus}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p role="alert" className={`mb-4 text-sm ${t.danger}`}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              autoFocus
              required
              dir="auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={field}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description <span className={`font-normal ${t.muted}`}>(optional)</span>
            </label>
            <textarea rows={3} dir="auto" value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Priority</span>
            <div className="flex gap-2" role="group" aria-label="Priority">
              {priorities.map((p) => {
                const active = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    aria-pressed={active}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                      active ? 'scale-[1.03] border-transparent text-[#101826]' : t.seg
                    } ${focus}`}
                    style={active ? { background: p.color } : undefined}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Due date <span className={`font-normal ${t.muted}`}>(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
              className={field}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={`rounded-xl px-4 py-2.5 text-sm font-medium ${t.ghost} ${focus}`}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`rounded-xl bg-[#F2B533] px-5 py-2.5 text-sm font-semibold text-[#101826] transition-all hover:scale-105 hover:bg-[#F7C455] disabled:opacity-50 ${focus}`}
            >
              {isSaving ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};