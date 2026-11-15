import { describe, expect, it } from 'vitest';
import { countFor, filterTasks, searchTasks } from './filters';
import type { Task } from '../../types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  _id: '1',
  title: 'Write report',
  status: 'PENDING',
  priority: 'MEDIUM',
  createdAt: '2026-11-01T10:00:00.000Z',
  updatedAt: '2026-11-01T10:00:00.000Z',
  ...overrides,
});

const tasks: Task[] = [
  makeTask({ _id: '1', title: 'Write report', status: 'PENDING' }),
  makeTask({ _id: '2', title: 'Fix login bug', status: 'IN_PROGRESS', description: 'Wrong password message' }),
  makeTask({ _id: '3', title: 'Deploy', status: 'COMPLETED' }),
  makeTask({ _id: '4', title: 'الذهاب للجيم', status: 'PENDING' }),
];

describe('filterTasks', () => {
  it('returns every task for ALL', () => {
    expect(filterTasks(tasks, 'ALL')).toHaveLength(4);
  });

  it('keeps only the tasks with the chosen status', () => {
    const result = filterTasks(tasks, 'PENDING');

    expect(result.map((task) => task._id)).toEqual(['1', '4']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterTasks(tasks, 'FAILED')).toEqual([]);
  });
});

describe('countFor', () => {
  it('counts the tasks of each status', () => {
    expect(countFor(tasks, 'ALL')).toBe(4);
    expect(countFor(tasks, 'PENDING')).toBe(2);
    expect(countFor(tasks, 'COMPLETED')).toBe(1);
    expect(countFor(tasks, 'FAILED')).toBe(0);
  });
});

describe('searchTasks', () => {
  it('returns everything for an empty or blank query', () => {
    expect(searchTasks(tasks, '')).toHaveLength(4);
    expect(searchTasks(tasks, '   ')).toHaveLength(4);
  });

  it('ignores the case of the letters', () => {
    expect(searchTasks(tasks, 'DEPLOY').map((task) => task._id)).toEqual(['3']);
  });

  it('ignores spaces around the query', () => {
    expect(searchTasks(tasks, '  deploy  ').map((task) => task._id)).toEqual(['3']);
  });

  it('also looks in the description', () => {
    expect(searchTasks(tasks, 'password').map((task) => task._id)).toEqual(['2']);
  });

  it('does not fail on a task without a description', () => {
    expect(() => searchTasks([makeTask({ description: undefined })], 'anything')).not.toThrow();
  });

  it('finds Arabic titles', () => {
    expect(searchTasks(tasks, 'الجيم').map((task) => task._id)).toEqual(['4']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(searchTasks(tasks, 'zzz')).toEqual([]);
  });
});