import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api';
import type { Task, TaskPriority } from '../types';

interface CreateTaskModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
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
        panel: 'bg-[#101826] border-[#26324A] text-[#E8ECF4]',
        field: 'bg-[#18233A] border-[#26324A] text-[#E8ECF4] placeholder:text-[#8B96AB] focus:border-[#F2B533]',
        muted: 'text-[#8B96AB]',
        danger: 'text-[#F07878]',
        btn: 'bg-[#E8ECF4] text-[#101826] hover:bg-white',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
        seg: 'border-[#26324A]',
        segOn: 'bg-[#E8ECF4] text-[#101826]',
        segOff: 'text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        panel: 'bg-[#EEF2F6] border-[#CBD3DF] text-[#14213D]',
        field: 'bg-white border-[#CBD3DF] text-[#14213D] placeholder:text-[#8B93A5] focus:border-[#14213D]',
        muted: 'text-[#5B6578]',
        danger: 'text-[#C23B3B]',
        btn: 'bg-[#14213D] text-[#EEF2F6] hover:bg-[#1f3159]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
        seg: 'border-[#CBD3DF]',
        segOn: 'bg-[#14213D] text-[#EEF2F6]',
        segOff: 'text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const field = `w-full rounded-md border px-3 py-2.5 text-[15px] outline-none transition-colors ${t.field}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101826]/60 p-4"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }
        .modal-in { animation: modalIn 0.18s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .modal-in { animation: none; } }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
        className={`modal-in w-full max-w-md rounded-lg border p-6 ${t.panel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="new-task-title" className="text-xl font-semibold tracking-tight">New task</h2>
          <button onClick={onClose} aria-label="Close" className={`rounded-md p-1.5 ${t.ghost} ${focus}`}>
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
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Priority</span>
            <div className={`flex overflow-hidden rounded-md border ${t.seg}`} role="group" aria-label="Priority">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  aria-pressed={priority === p.value}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${priority === p.value ? t.segOn : t.segOff}`}
                >
                  {p.label}
                </button>
              ))}
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
            <button type="button" onClick={onClose} className={`rounded-md px-4 py-2.5 text-sm font-medium ${t.ghost} ${focus}`}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${t.btn} ${focus}`}
            >
              {isSaving ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};