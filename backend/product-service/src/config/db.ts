import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Product DB connected successfully');
  } catch (error) {
    console.error('Product DB connection failed:', error);
    process.exit(1);
  }
};
