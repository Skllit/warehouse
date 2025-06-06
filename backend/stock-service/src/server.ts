import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5005;

const startServer = async () => {
  try {
    await connectDB();
  app.listen(PORT, () => console.log(`Stock-Service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
