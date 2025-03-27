const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  submitRating,
  getStoreRatings,
  getStoreAverageRating,
  getUserStoreRating,
  getRatingStats
} = require('../controllers/ratingController');

// Submit or update a rating (requires user authentication)
router.post('/submit', authenticate, roleAuth(['user', 'store_owner']), submitRating);

// Get all ratings for a store
router.get('/store/:store_id', authenticate, getStoreRatings);

// Get average rating for a store
router.get('/store/:store_id/average', authenticate, getStoreAverageRating);

// Get user's rating for a specific store (requires user authentication)
router.get('/user/store/:store_id', authenticate, roleAuth(['user', 'store_owner']), getUserStoreRating);

// Get rating statistics (requires admin authentication)
router.get('/stats', authenticate, roleAuth(['admin']), getRatingStats);

module.exports = router;