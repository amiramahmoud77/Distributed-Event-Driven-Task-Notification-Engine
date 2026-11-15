import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../src/app';
import { Task } from '../src/models/task.model';
import { User } from '../src/models/user.model';
import { taskQueue } from '../src/queues/task.queue';

const PASSWORD = 'Test1234!';
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const signup = async (email: string) => {
  const res = await request(app).post('/api/auth/signup').send({ name: 'Test', email, password: PASSWORD });
  return { token: res.body.token as string, id: res.body.data.id as string };
};

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

const createTask = async (token: string, body: object = { title: 'A task' }) => {
  const res = await request(app).post('/api/tasks').set(bearer(token)).send(body);
  return res.body.data;
};

// One user who owns a task, and another user who does not.
const setupTwoUsers = async () => {
  const owner = await signup('owner@example.com');
  const other = await signup('other@example.com');
  const task = await createTask(owner.token, { title: 'Private task' });
  return { owner, other, task };
};

describe('authentication', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(401);
  });
});

describe('creating tasks', () => {
  it('saves the task with the logged-in user as its owner', async () => {
    const owner = await signup('owner@example.com');

    const res = await request(app).post('/api/tasks').set(bearer(owner.token)).send({ title: 'Write tests' });

    expect(res.status).toBe(201);
    expect(res.body.data.userId).toBe(owner.id);
  });

  it('sends the owner’s email to the queue', async () => {
    const owner = await signup('owner@example.com');

    await createTask(owner.token);

    expect(taskQueue.add).toHaveBeenCalledWith(
      'TASK_CREATED',
      expect.objectContaining({ userEmail: 'owner@example.com' })
    );
  });

  it('rejects a missing title', async () => {
    const owner = await signup('owner@example.com');

    const res = await request(app).post('/api/tasks').set(bearer(owner.token)).send({});

    expect(res.status).toBe(400);
  });

  it('rejects a title that is too long with a clear message', async () => {
    const owner = await signup('owner@example.com');

    const res = await request(app)
      .post('/api/tasks')
      .set(bearer(owner.token))
      .send({ title: 'x'.repeat(200) });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at most 120/);
  });
});

describe('listing tasks', () => {
  it('only lists the tasks of the logged-in user', async () => {
    const first = await signup('first@example.com');
    const second = await signup('second@example.com');
    await createTask(first.token, { title: 'First A' });
    await createTask(first.token, { title: 'First B' });
    await createTask(second.token, { title: 'Second A' });

    const firstList = await request(app).get('/api/tasks').set(bearer(first.token));
    const secondList = await request(app).get('/api/tasks').set(bearer(second.token));

    expect(firstList.body.total).toBe(2);
    expect(secondList.body.total).toBe(1);
    expect(secondList.body.data[0].title).toBe('Second A');
  });
});

describe('a user who does not own the task', () => {
  it('cannot read it', async () => {
    const { owner, other, task } = await setupTwoUsers();

    const asOther = await request(app).get(`/api/tasks/${task._id}`).set(bearer(other.token));
    const asOwner = await request(app).get(`/api/tasks/${task._id}`).set(bearer(owner.token));

    expect(asOther.status).toBe(404);
    expect(asOwner.status).toBe(200);
  });

  it('cannot change its status', async () => {
    const { other, task } = await setupTwoUsers();

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set(bearer(other.token))
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(404);
    expect((await Task.findById(task._id))?.status).toBe('PENDING');
  });

  it('cannot edit it', async () => {
    const { other, task } = await setupTwoUsers();

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set(bearer(other.token))
      .send({ title: 'Hacked' });

    expect(res.status).toBe(404);
    expect((await Task.findById(task._id))?.title).toBe('Private task');
  });

  it('cannot delete it', async () => {
    const { other, task } = await setupTwoUsers();

    const res = await request(app).delete(`/api/tasks/${task._id}`).set(bearer(other.token));

    expect(res.status).toBe(404);
    expect(await Task.findById(task._id)).not.toBeNull();
  });
});

describe('the owner of a task', () => {
  it('can edit the allowed fields but not the owner or the status', async () => {
    const { owner, other, task } = await setupTwoUsers();

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set(bearer(owner.token))
      .send({ title: 'New title', status: 'FAILED', userId: other.id });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('New title');
    expect(res.body.data.status).toBe('PENDING');
    expect(res.body.data.userId).toBe(owner.id);
  });

  it('can change the status', async () => {
    const { owner, task } = await setupTwoUsers();

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set(bearer(owner.token))
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('IN_PROGRESS');
  });

  it('gets a 400 for a status that does not exist', async () => {
    const { owner, task } = await setupTwoUsers();

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set(bearer(owner.token))
      .send({ status: 'done' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/PENDING/);
  });

  it('can delete it', async () => {
    const { owner, task } = await setupTwoUsers();

    const res = await request(app).delete(`/api/tasks/${task._id}`).set(bearer(owner.token));

    expect(res.status).toBe(200);
    expect(await Task.findById(task._id)).toBeNull();
  });

  it('gets a 400 for an id that is not valid', async () => {
    const owner = await signup('owner@example.com');

    const res = await request(app).get('/api/tasks/abc').set(bearer(owner.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('The id is not valid.');
  });
});

describe('an admin', () => {
  it('can read and delete a task that belongs to someone else', async () => {
    const owner = await signup('owner@example.com');
    const task = await createTask(owner.token, { title: 'Someone else’s task' });

    await signup('admin@example.com');
    await User.updateOne({ email: 'admin@example.com' }, { role: 'admin' });
    // The role lives in the token, so log in again to get an admin token.
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: PASSWORD });
    const adminToken = login.body.token;

    const read = await request(app).get(`/api/tasks/${task._id}`).set(bearer(adminToken));
    const remove = await request(app).delete(`/api/tasks/${task._id}`).set(bearer(adminToken));

    expect(read.status).toBe(200);
    expect(remove.status).toBe(200);
  });
});