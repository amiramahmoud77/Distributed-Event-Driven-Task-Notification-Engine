import { Request, Response } from 'express';
import { Task } from '../models/task.model';
import { taskQueue } from '../queues/task.queue';

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
    });

    await taskQueue.add('TASK_CREATED', {
      taskId: task._id,
      title: task.title,
      action: 'CREATED',
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    await taskQueue.add('TASK_UPDATED', {
      taskId: task._id,
      title: task.title,
      status: task.status,
      action: 'UPDATED',
      updatedAt: new Date(),
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};