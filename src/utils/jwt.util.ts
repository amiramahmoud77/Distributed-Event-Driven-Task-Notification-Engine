import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

// The email is optional so existing callers keep working. It is not a secret,
// and the notification worker needs it to know who to write to.
export const generateToken = (userId: string, role: string, email?: string): string => {
  return jwt.sign({ id: userId, role, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};