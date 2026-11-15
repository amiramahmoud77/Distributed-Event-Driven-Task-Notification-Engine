import { describe, expect, it } from 'vitest';
import { sortTasks } from './sort';
import type { Task } from '../../types';

// Builds a complete task with default values; each test overrides only what it cares about.
const makeTask = (overrides: Partial<Task> = {}): Task => ({
  _id: '1',
  title: 'A task',
  status: 'PENDING',
  priority: 'MEDIUM',
  createdAt: '2026-11-01T10:00:00.000Z',
  updatedAt: '2026-11-01T10:00:00.000Z',
  ...overrides,
});

// Created order (oldest to newest): a, c, b, d.
const tasks: Task[] = [
  makeTask({ _id: 'a', createdAt: '2026-11-01T10:00:00.000Z', priority: 'HIGH', dueDate: '2026-11-20T00:00:00.000Z' }),
  makeTask({ _id: 'b', createdAt: '2026-11-03T10:00:00.000Z', priority: 'LOW' }),
  makeTask({ _id: 'c', createdAt: '2026-11-02T10:00:00.000Z', priority: 'MEDIUM', dueDate: '2026-11-10T00:00:00.000Z' }),
  makeTask({ _id: 'd', createdAt: '2026-11-04T10:00:00.000Z', priority: 'HIGH', dueDate: '2026-11-15T00:00:00.000Z' }),
];

const ids = (list: Task[]) => list.map((task) => task._id);

describe('sortTasks', () => {
  it('puts the newest task first for NEWEST', () => {
    expect(ids(sortTasks(tasks, 'NEWEST'))).toEqual(['d', 'b', 'c', 'a']);
  });

  it('puts the oldest task first for OLDEST', () => {
    expect(ids(sortTasks(tasks, 'OLDEST'))).toEqual(['a', 'c', 'b', 'd']);
  });

  it('puts the highest priority first for PRIORITY, newest first when equal', () => {
    // HIGH: d (newer) before a, then MEDIUM c, then LOW b.
    expect(ids(sortTasks(tasks, 'PRIORITY'))).toEqual(['d', 'a', 'c', 'b']);
  });

  it('puts the soonest due date first for DUE and tasks without a date last', () => {
    expect(ids(sortTasks(tasks, 'DUE'))).toEqual(['c', 'd', 'a', 'b']);
  });

  it('orders tasks that have no due date newest first', () => {
    const noDates = [
      makeTask({ _id: 'x', createdAt: '2026-11-01T10:00:00.000Z' }),
      makeTask({ _id: 'y', createdAt: '2026-11-02T10:00:00.000Z' }),
    ];

    expect(ids(sortTasks(noDates, 'DUE'))).toEqual(['y', 'x']);
  });

  it('does not change the array it receives', () => {
    const before = ids(tasks);

    sortTasks(tasks, 'OLDEST');

    expect(ids(tasks)).toEqual(before);
  });

  it('returns a new array, not the same one', () => {
    expect(sortTasks(tasks, 'NEWEST')).not.toBe(tasks);
  });

  it('returns an empty list for an empty list', () => {
    expect(sortTasks([], 'PRIORITY')).toEqual([]);
  });
});