
const pool = require('../config/db');
console.log('Pool Object:', pool); // Debugging
console.log('Type of pool.connect:', typeof pool.connect); // Check if connect exists

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields',
        field: !name ? 'name' : !email ? 'email' : !password ? 'password' : 'role'
      });
    }

    if (name.length < 10 || name.length > 60) {
      return res.status(400).json({ 
        success: false,
        message: 'Name must be between 20 and 60 characters',
        field: 'name'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be between 8 and 16 characters',
        field: 'password'
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must contain at least one uppercase letter, one special character, and one number',
        field: 'password'
      });
    }

    if (!['user', 'store_owner'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role selected',
        field: 'role'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists',
        field: 'email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hashedPassword, address || null, role]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again later.',
      error: err.message
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials',
        field: 'email'
      });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials',
        field: 'password'
      });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again later.',
      error: err.message
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = { login, register };