import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../src/app';
import { Task } from '../src/models/task.model';
import { User } from '../src/models/user.model';

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

// Each test starts with one user who owns 105 tasks (more than the largest page).
beforeEach(async () => {
  const signup = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test', email: 'owner@example.com', password: 'Test1234!' });

  token = signup.body.token;

  await Task.insertMany(
    Array.from({ length: 105 }, (_, index) => ({
      title: `Task ${index + 1}`,
      userId: signup.body.data.id,
    }))
  );
});

afterEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const list = (query = '') => request(app).get(`/api/tasks${query}`).set({ Authorization: `Bearer ${token}` });

describe('GET /api/tasks pagination', () => {
  it('returns 10 tasks when no limit is given', async () => {
    const res = await list();

    expect(res.body.count).toBe(10);
    expect(res.body.total).toBe(105);
    expect(res.body.totalPages).toBe(11);
  });

  it('respects a limit that is allowed', async () => {
    const res = await list('?limit=20');

    expect(res.body.count).toBe(20);
    expect(res.body.totalPages).toBe(6);
  });

  it('caps a limit that is too large at 100', async () => {
    const res = await list('?limit=1000');

    expect(res.body.count).toBe(100);
    expect(res.body.totalPages).toBe(2);
  });

  it('uses the default when the limit is not a number', async () => {
    const res = await list('?limit=abc');

    expect(res.body.count).toBe(10);
  });

  it('raises a negative limit to 1', async () => {
    const res = await list('?limit=-5');

    expect(res.body.count).toBe(1);
  });

  it('returns the rest of the tasks on the last page', async () => {
    const res = await list('?page=2&limit=100');

    expect(res.body.count).toBe(5);
    expect(res.body.currentPage).toBe(2);
  });

  it('treats page 0 as page 1', async () => {
    const res = await list('?page=0');

    expect(res.body.currentPage).toBe(1);
  });

  it('treats a page that is not a number as page 1', async () => {
    const res = await list('?page=abc');

    expect(res.body.currentPage).toBe(1);
  });
});