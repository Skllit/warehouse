// import app from './app';

import dotenv from 'dotenv';
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
  });
});
