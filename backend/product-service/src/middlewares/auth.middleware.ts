import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Auth headers:', req.headers.authorization); // Debug log
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided'); // Debug log
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debug log
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 