// Role-based authorization middleware
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists in request (should be set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Unauthorized: User not authenticated',
          error: 'Please log in first' 
        });
      }

      // Check if user's role is in the allowed roles
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: 'Forbidden: Access denied',
          error: `You do not have permission to access this resource. Required roles: ${allowedRoles.join(', ')}`,
          userRole: userRole
        });
      }

      // User has required role, proceed
      next();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  };
};

module.exports = roleMiddleware;
