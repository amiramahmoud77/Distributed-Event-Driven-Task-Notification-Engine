import { Response } from 'express';

// Turns an error thrown by Mongoose into a clear HTTP response.
// Details of unexpected errors stay in the server log and are never sent to the client.
export const sendError = (res: Response, error: any): void => {
  if (error?.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item: any) => item.message);
    res.status(400).json({ success: false, message: messages.join(' ') });
    return;
  }

  if (error?.name === 'CastError') {
    res.status(400).json({ success: false, message: 'The id is not valid.' });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'Server error' });
};