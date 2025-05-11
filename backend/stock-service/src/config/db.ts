import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Environment variables:', {
      MONGODB_URI: mongoUri ? 'exists' : 'missing',
      NODE_ENV: process.env.NODE_ENV
    });
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Stock DB connected successfully');
  } catch (error) {
    console.error('Stock DB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
