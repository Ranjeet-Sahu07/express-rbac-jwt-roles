const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded sample users with roles
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'moderator', password: 'mod123', role: 'moderator' },
  { username: 'user', password: 'user123', role: 'user' }
];

// Login route
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Bad Request',
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'Invalid username or password' 
      });
    }

    // Generate JWT token with user info and role
    const token = jwt.sign(
      { 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token to client
    res.json({ 
      message: 'Login successful',
      token: token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = router;
