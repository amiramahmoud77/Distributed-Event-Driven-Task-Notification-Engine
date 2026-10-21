import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(express.json()); 
app.use(cors());        

// Main Task Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Task Engine API is running successfully!' });
});

export default app;