import type { TaskPriority, TaskStatus } from '../../types';

export const palette: Record<TaskStatus, { dark: string; light: string; label: string }> = {
  PENDING: { dark: '#F2B533', light: '#B07A00', label: 'Pending' },
  IN_PROGRESS: { dark: '#7FA2F5', light: '#2B50AA', label: 'In progress' },
  COMPLETED: { dark: '#5CC49A', light: '#1F8A5F', label: 'Completed' },
  FAILED: { dark: '#F07878', light: '#C23B3B', label: 'Failed' },
};

export const priorityColor: Record<TaskPriority, { dark: string; light: string }> = {
  HIGH: { dark: '#F08A7E', light: '#D4503F' },
  MEDIUM: { dark: '#B79CF2', light: '#7A55D6' },
  LOW: { dark: '#6FC3CF', light: '#1F8A9A' },
};

export const priorityLevel: Record<TaskPriority, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
export const priorityLabel: Record<TaskPriority, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

export const radii = [
  '26px 30px 24px 32px',
  '30px 24px 32px 26px',
  '24px 32px 26px 30px',
  '32px 26px 30px 24px',
];

export const nextStatus: Partial<Record<TaskStatus, TaskStatus>> = {
  PENDING: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

export const nextAction: Partial<Record<TaskStatus, string>> = {
  PENDING: 'Start',
  IN_PROGRESS: 'Complete',
};