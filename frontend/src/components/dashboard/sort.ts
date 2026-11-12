import type { Task, TaskPriority } from '../../types';

export type SortKey = 'NEWEST' | 'OLDEST' | 'PRIORITY' | 'DUE';

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'NEWEST', label: 'Newest first' },
  { value: 'OLDEST', label: 'Oldest first' },
  { value: 'PRIORITY', label: 'Highest priority' },
  { value: 'DUE', label: 'Due soonest' },
];

const priorityRank: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

const time = (iso: string) => new Date(iso).getTime();

export const sortTasks = (tasks: Task[], key: SortKey) => {
  // Copy first: sort() changes the array in place, and React state must not be mutated.
  const sorted = [...tasks];

  switch (key) {
    case 'OLDEST':
      return sorted.sort((a, b) => time(a.createdAt) - time(b.createdAt));

    case 'PRIORITY':
      return sorted.sort(
        (a, b) => priorityRank[b.priority] - priorityRank[a.priority] || time(b.createdAt) - time(a.createdAt)
      );

    case 'DUE':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return time(b.createdAt) - time(a.createdAt);
        if (!a.dueDate) return 1; // tasks without a due date go last
        if (!b.dueDate) return -1;
        return time(a.dueDate) - time(b.dueDate);
      });

    default:
      return sorted.sort((a, b) => time(b.createdAt) - time(a.createdAt));
  }
};