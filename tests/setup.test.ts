import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('runs with a test JWT secret', () => {
    expect(process.env.JWT_SECRET).toBe('test-secret-only-for-tests');
  });
});