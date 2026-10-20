import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/task_engine_db');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};