import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../api';
import type { Task, TaskPriority } from '../types';

interface CreateTaskModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isDarkMode, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const input = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
    isDarkMode
      ? 'bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500'
      : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
  }`;
  const label = `mb-2 block text-xs font-semibold uppercase tracking-wider ${
    isDarkMode ? 'text-zinc-400' : 'text-slate-600'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isDarkMode ? 'border-zinc-800 bg-zinc-950 text-zinc-100' : 'border-slate-200 bg-white text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">New Task</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-500/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={label}>Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" className={input} />
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" className={input} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={input}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className={label}>Due date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};