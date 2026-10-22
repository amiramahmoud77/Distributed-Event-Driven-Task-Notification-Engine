import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.use(protect);

router.route('/').post(createTask).get(getTasks);

router.route('/:id').get(getTaskById).put(updateTask).delete(authorize('admin'), deleteTask);

export default router;