// @ts-nocheck
import { Request, Response } from 'express';
import { Task, TaskStatus } from '../models/task.model';
import { taskQueue } from '../queues/task.queue';
import { sendError } from '../utils/sendError';

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = Object.values(TaskStatus);
    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid or missing status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
      return;
    }

    // Admins can change any task; everyone else only their own.
    const filter: any = { _id: id };
    if (req.user?.role !== 'admin') {
      filter.userId = req.user?.id;
    }

    const task = await Task.findOneAndUpdate(
      filter,
      { status },
      { new: true, runValidators: true }
    );

    // A task that belongs to someone else looks the same as a missing one,
    // so ids cannot be probed.
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Shape expected by the worker: a task object and the user's email
    await taskQueue.add('TASK_STATUS_CHANGED', {
      task: {
        title: task.title,
        status: task.status,
      },
      userEmail: req.user?.email,
    });

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  } catch (error) {
    sendError(res, error);
  }
};