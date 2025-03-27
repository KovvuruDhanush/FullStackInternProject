const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createUserTable } = require('./models/userModel');
const { createStoreTable } = require('./models/storeModel');
const { createRatingTable } = require('./models/ratingModel');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const pool = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database tables
const initializeTables = async () => {
  await createUserTable();
  await createStoreTable();
  await createRatingTable();
};

initializeTables();

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connection successful', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);

module.exports = app;