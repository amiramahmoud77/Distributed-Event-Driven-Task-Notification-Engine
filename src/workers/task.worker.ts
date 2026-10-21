import { Worker } from 'bullmq';
import { NotificationService } from '../services/notification.service';

const worker = new Worker(
  'task-events',
  async job => {
    console.log(`Processing job ${job.id} with name: ${job.name}`);
    await NotificationService.sendNotification(job.name, job.data);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed successfully!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with error ${err.message}`);
});