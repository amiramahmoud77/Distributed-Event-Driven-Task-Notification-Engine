import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

// Route: /api/tasks
router.route('/').post(createTask).get(getTasks);

// Route: /api/tasks/:id
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;