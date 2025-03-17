const express = require('express');
const { addUser, getUsers } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.post('/users', authenticate, addUser);
router.get('/users', authenticate, getUsers);

module.exports = router;