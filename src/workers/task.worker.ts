import { Worker } from 'bullmq';
import { sendTaskNotificationEmail } from '../services/email.service';

const worker = new Worker(
  'task-events',
  async (job) => {
    console.log(`Processing job ${job.id} with name: ${job.name}`);
    const { task, userEmail } = job.data;

    if (userEmail) {
      await sendTaskNotificationEmail(
        userEmail,
        `Task ${job.name.toUpperCase()}: ${task?.title || 'Notification'}`,
        task?.title || 'Task Details',
        job.name
      );
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed successfully!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with error ${err.message}`);
});

export default worker;