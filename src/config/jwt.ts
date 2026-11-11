const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set. Add it to your .env file.');
}

export const JWT_SECRET: string = secret;