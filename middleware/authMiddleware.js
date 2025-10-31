const jwt = require('jsonwebtoken');

// Authentication middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized: No token provided',
        error: 'Authentication required' 
      });
    }

    // Extract token from Bearer <token>
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid token',
        error: error.message 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Unauthorized: Token expired',
        error: error.message 
      });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
