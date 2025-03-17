const express = require('express');
const { addStore, getStores } = require('../controllers/storeController');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.post('/stores', authenticate, addStore);
router.get('/stores', authenticate, getStores);

module.exports = router;