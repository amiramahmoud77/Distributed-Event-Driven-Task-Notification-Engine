import express from 'express';
import { setupSwagger } from './config/swagger'; 
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(express.json());

// Initialize Swagger Documentation
setupSwagger(app);

// Routes (Example)
// app.use('/api/v1/tasks', taskRoutes);

// Global Error Handler Middleware (Must be the last middleware)
app.use(globalErrorHandler);

export default app;