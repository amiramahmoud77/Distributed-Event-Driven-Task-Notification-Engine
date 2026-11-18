import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './config/swagger';
import { globalErrorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

// Health check for the platform that runs the container. It sits before the rate
// limiter, so frequent checks are never blocked, and it answers 503 when MongoDB is down.
app.get('/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes!',
  },
});

app.use('/api', limiter);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

setupSwagger(app);

app.use(globalErrorHandler);

export default app;