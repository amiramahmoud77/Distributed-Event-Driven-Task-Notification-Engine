import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './config/swagger';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. Rate Limiting (Limit requests from same IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes!',
  },
});

// Apply rate limiter to all API requests
app.use('/api', limiter);

// Middlewares
app.use(express.json());

// Initialize Swagger Documentation
setupSwagger(app);

// Global Error Handler Middleware (Must be the last middleware)
app.use(globalErrorHandler);

export default app;