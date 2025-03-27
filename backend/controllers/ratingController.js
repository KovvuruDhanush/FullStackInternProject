const db = require('../config/db');

const submitRating = async (req, res) => {
    const { store_id, rating, comment } = req.body;
    const user_id = req.user.id;
    const client = await db.getClient();

    try {
        if (!store_id || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Store ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        await client.query('BEGIN');

        // Check if store exists
        const storeCheck = await client.query('SELECT name FROM stores WHERE id = $1', [store_id]);
        if (storeCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Get user information
        const userResult = await client.query('SELECT username FROM users WHERE id = $1', [user_id]);
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const username = userResult.rows[0].username;
        const storeName = storeCheck.rows[0].name;

        // Check for existing rating
        const existingRating = await client.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [user_id, store_id]
        );

        let result;
        if (existingRating.rows.length > 0) {
            // Update existing rating
            result = await client.query(
                'UPDATE ratings SET rating = $1, comment = $2, updated_at = NOW() WHERE user_id = $3 AND store_id = $4 RETURNING *',
                [rating, comment, user_id, store_id]
            );
        } else {
            // Insert new rating
            result = await client.query(
                'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
                [user_id, store_id, rating, comment]
            );
        }

        // Calculate new average rating
        const avgResult = await client.query(
            'SELECT AVG(rating)::numeric(10,2) as average_rating FROM ratings WHERE store_id = $1',
            [store_id]
        );

        await client.query('COMMIT');

        const ratingData = {
            ...result.rows[0],
            username,
            storeName,
            averageRating: avgResult.rows[0].average_rating
        };

        // Broadcast the rating update through WebSocket
        if (global.wsService) {
            global.wsService.broadcastRatingUpdate(ratingData);
        }

        res.status(201).json({
            success: true,
            data: ratingData
        });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({
            success: false,
            error: 'Error submitting rating'
        });
    }
};

// Get store ratings
const getStoreRatings = async (req, res) => {
  const { store_id } = req.params;

  if (!store_id) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required'
    });
  }

  try {
    const result = await db.query(
      `SELECT r.*, u.username as user_name, 
              to_char(r.created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store_id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching store ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching store ratings'
    });
  }
};

// Get average rating for a store
const getStoreAverageRating = async (req, res) => {
  const { store_id } = req.params;

  if (!store_id) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required'
    });
  }

  try {
    const result = await db.query(
      `SELECT 
        AVG(rating)::numeric(10,2) as average_rating,
        COUNT(*) as total_ratings,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM ratings 
      WHERE store_id = $1`,
      [store_id]
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        average_rating: result.rows[0].average_rating || 0
      }
    });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching average rating'
    });
  }
};

// Get user's rating for a store
const getUserStoreRating = async (req, res) => {
  const { store_id } = req.params;
  const user_id = req.user.id;

  if (!store_id) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required'
    });
  }

  try {
    const result = await db.query(
      `SELECT rating, comment, 
              to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as rated_at
       FROM ratings 
       WHERE user_id = $1 AND store_id = $2`,
      [user_id, store_id]
    );

    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user rating'
    });
  }
};

// Get rating statistics for admin dashboard
const getRatingStats = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_ratings,
        AVG(rating)::numeric(10,2) as average_rating,
        COUNT(DISTINCT store_id) as rated_stores,
        COUNT(DISTINCT user_id) as rating_users,
        MAX(created_at) as latest_rating
      FROM ratings`
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        total_ratings: parseInt(result.rows[0].total_ratings),
        rated_stores: parseInt(result.rows[0].rated_stores),
        rating_users: parseInt(result.rows[0].rating_users)
      }
    });
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rating statistics'
    });
  }
};

module.exports = {
  submitRating,
  getStoreRatings,
  getStoreAverageRating,
  getUserStoreRating,
  getRatingStats
};