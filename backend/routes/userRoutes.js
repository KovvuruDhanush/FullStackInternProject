const express = require('express');
const { addUser, getUsers, getUserById, updatePassword } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const router = express.Router();

// Create a new user (admin only)
router.post('/', authenticate, roleAuth(['admin']), addUser);

// Get all users (admin only)
router.get('/', authenticate, roleAuth(['admin']), getUsers);

// Get user profile (authenticated user)
router.get('/profile', authenticate, (req, res) => {
  res.json(req.user);
});

// Update user profile (authenticated user)
router.put('/profile', authenticate, (req, res) => {
  // TODO: Implement profile update logic
  res.status(501).json({ message: 'Not implemented yet' });
});

// Update user password (authenticated user)
router.put('/update-password', authenticate, updatePassword);

// Get user by ID (admin only)
router.get('/:id', authenticate, roleAuth(['admin']), getUserById);

module.exports = router;