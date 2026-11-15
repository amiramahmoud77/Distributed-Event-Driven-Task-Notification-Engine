import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import { User } from '../src/models/user.model';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const signupBody = { name: 'Test User', email: 'test@example.com', password: 'Test1234!' };

describe('POST /api/auth/signup', () => {
  it('creates an account and returns a token', async () => {
    const res = await request(app).post('/api/auth/signup').send(signupBody);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('never returns the password', async () => {
    const res = await request(app).post('/api/auth/signup').send(signupBody);

    expect(JSON.stringify(res.body)).not.toContain('Test1234!');
    expect(res.body.data.password).toBeUndefined();
  });

  it('ignores a role sent in the request body', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...signupBody, role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('user');
  });

  it('rejects a missing field', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects an email that is already registered', async () => {
    await request(app).post('/api/auth/signup').send(signupBody);
    const res = await request(app).post('/api/auth/signup').send(signupBody);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with the right credentials', async () => {
    await request(app).post('/api/auth/signup').send(signupBody);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: signupBody.email, password: signupBody.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('puts the email in the token', async () => {
    await request(app).post('/api/auth/signup').send(signupBody);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: signupBody.email, password: signupBody.password });

    const payload = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64url').toString());
    expect(payload.email).toBe('test@example.com');
    expect(payload.role).toBe('user');
  });

  it('rejects a wrong password with 401', async () => {
    await request(app).post('/api/auth/signup').send(signupBody);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: signupBody.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('gives the same answer for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});