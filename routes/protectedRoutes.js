const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// Admin-only route
router.get('/admin/dashboard', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ 
    message: 'Welcome to Admin Dashboard',
    user: req.user,
    data: {
      description: 'This is a protected route accessible only by Admin users',
      adminFeatures: ['User Management', 'System Configuration', 'Full Access']
    }
  });
});

// Moderator and Admin route
router.get('/moderator/manage', authMiddleware, roleMiddleware('moderator', 'admin'), (req, res) => {
  res.json({ 
    message: 'Welcome to Moderator Management Panel',
    user: req.user,
    data: {
      description: 'This route is accessible by Moderators and Admins',
      features: ['Content Moderation', 'User Reports', 'Community Management']
    }
  });
});

// Any authenticated user route
router.get('/user/profile', authMiddleware, roleMiddleware('user', 'moderator', 'admin'), (req, res) => {
  res.json({ 
    message: 'Welcome to User Profile',
    user: req.user,
    data: {
      description: 'This route is accessible by any authenticated user',
      features: ['View Profile', 'Edit Settings', 'View Dashboard']
    }
  });
});

module.exports = router;
