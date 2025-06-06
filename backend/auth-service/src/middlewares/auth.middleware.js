const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
