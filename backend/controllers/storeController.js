const db = require('../config/db');

const createStore = async (req, res) => {
    const { name, description, address } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO stores (name, description, address) VALUES ($1, $2, $3) RETURNING *',
            [name, description, address]
        );

        const storeData = result.rows[0];

        // Get store's average rating if exists
        const ratingResult = await db.query(
            'SELECT AVG(rating)::numeric(10,2) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE store_id = $1',
            [storeData.id]
        );

        const enhancedStoreData = {
            ...storeData,
            average_rating: ratingResult.rows[0].average_rating || 0,
            total_ratings: parseInt(ratingResult.rows[0].total_ratings) || 0
        };

        // Broadcast store creation through WebSocket
        if (global.wsService) {
            global.wsService.broadcastStoreUpdate({
                type: 'STORE_CREATED',
                data: enhancedStoreData
            });
        }

        res.status(201).json({
            success: true,
            data: enhancedStoreData
        });
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(500).json({
            success: false,
            message: 'Store creation failed',
            error: error.message
        });
    }
};

const getStores = async (req, res) => {
  try {
    const stores = await db.query('SELECT * FROM stores');
    res.json(stores.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStore, getStores };