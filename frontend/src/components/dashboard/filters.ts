import type { Task, TaskStatus } from '../../types';

export type StatusFilter = 'ALL' | TaskStatus;

export const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
];

export const filterTasks = (tasks: Task[], filter: StatusFilter) =>
  filter === 'ALL' ? tasks : tasks.filter((task) => task.status === filter);

export const countFor = (tasks: Task[], filter: StatusFilter) => filterTasks(tasks, filter).length;