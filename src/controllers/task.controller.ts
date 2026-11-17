// @ts-nocheck
import { Request, Response } from 'express';
import { Task } from '../models/task.model';
import { taskQueue } from '../queues/task.queue';
import { sendError } from '../utils/sendError';

// The largest page the API will return, so one request cannot ask for everything.
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

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
      userId: req.user?.id,
    });

    await taskQueue.add('TASK_CREATED', {
      taskId: task._id,
      title: task.title,
      action: 'CREATED',
      userEmail: req.user?.email,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    sendError(res, error);
  }
};

// Get all tasks with search, filters, and pagination
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, search } = req.query;

    // Anything that is not a sensible number falls back to a safe value.
    const page = Math.max(Math.floor(Number(req.query.page)) || 1, 1);
    const limit = Math.min(
      Math.max(Math.floor(Number(req.query.limit)) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );

    const query: any = {};

    if (req.user && req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: tasks,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Admins can read any task; everyone else only their own.
    const filter: any = { _id: req.params.id };
    if (req.user?.role !== 'admin') {
      filter.userId = req.user?.id;
    }

    const task = await Task.findOne(filter);

    // Someone else's task looks the same as a missing one.
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    sendError(res, error);
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Only these fields can be edited here. Status has its own endpoint,
    // and userId must never be changed from the outside.
    const { title, description, priority, dueDate } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    // Admins can edit any task; everyone else only their own.
    const filter: any = { _id: req.params.id };
    if (req.user?.role !== 'admin') {
      filter.userId = req.user?.id;
    }

    const task = await Task.findOneAndUpdate(filter, updates, {
      returnDocument: 'after',
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
      userEmail: req.user?.email,
      updatedAt: new Date(),
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    sendError(res, error);
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Admins can delete any task; everyone else only their own.
    const filter: any = { _id: req.params.id };
    if (req.user?.role !== 'admin') {
      filter.userId = req.user?.id;
    }

    const task = await Task.findOneAndDelete(filter);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
};