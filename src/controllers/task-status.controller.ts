// @ts-nocheck
import { Request, Response } from 'express';
import { Task, TaskStatus } from '../models/task.model';
import { taskQueue } from '../queues/task.queue';

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

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

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
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};