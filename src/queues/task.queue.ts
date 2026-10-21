import { Queue } from 'bullmq';

export const taskQueue = new Queue('task-events', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});