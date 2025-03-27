const express = require('express');
const { createStore, getStores } = require('../controllers/storeController');
const authenticate = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const router = express.Router();

// Create a new store (store_owner only)
router.post('/', authenticate, roleAuth(['store_owner']), createStore);

// Get all stores (accessible to all authenticated users)
router.get('/', authenticate, getStores);

// Get stores by owner (store_owner and admin only)
router.get('/owner/:owner_id', authenticate, roleAuth(['store_owner', 'admin']), getStores);

module.exports = router;