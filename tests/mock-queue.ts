import { vi } from 'vitest';

// The real queue connects to Redis as soon as it is imported. Tests do not need
// Redis, so every test file gets a fake queue instead.
vi.mock('../src/queues/task.queue', () => ({
  taskQueue: { add: vi.fn().mockResolvedValue(undefined) },
}));