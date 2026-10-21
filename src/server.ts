import app from './app';
import { connectDB } from './config/db';
import './workers/task.worker';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Task Worker is active and listening for events...`);
  });
});