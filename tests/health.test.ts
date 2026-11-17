import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../src/app';

describe('GET /health', () => {
  let mongo: MongoMemoryServer | undefined;

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
  });

  it('answers 503 while the database is not connected', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'unavailable', database: 'disconnected' });
  });

  it('answers 200 without a token once the database is connected', async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'connected' });
  });

  it('is not blocked by the rate limiter', async () => {
    const statuses: number[] = [];

    for (let i = 0; i < 120; i++) {
      const res = await request(app).get('/health');
      statuses.push(res.status);
    }

    expect(statuses.every((status) => status === 200)).toBe(true);
  });
});