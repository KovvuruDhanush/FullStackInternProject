const pool = require('../config/db');

const addStore = async (req, res) => {
  const { name, email, address } = req.body;
  try {
    const newStore = await pool.query(
      'INSERT INTO stores (name, email, address) VALUES ($1, $2, $3) RETURNING *',
      [name, email, address]
    );
    res.status(201).json(newStore.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await pool.query('SELECT * FROM stores');
    res.json(stores.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addStore, getStores };