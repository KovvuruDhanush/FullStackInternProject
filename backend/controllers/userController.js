const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validations');

const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    // Validate input
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ message: nameError, field: 'name' });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError, field: 'email' });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError, field: 'password' });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ message: addressError, field: 'address' });

    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use', field: 'email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );
    
    // Notify connected clients about new user
    if (global.wsService) {
      global.wsService.broadcastUserUpdate({
        type: 'USER_CREATED',
        data: newUser.rows[0]
      });
    }
    
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Server error while adding user' });
  }
};

const getUsers = async (req, res) => {
  try {
    // Get filter parameters
    const { name, email, address, role } = req.query;
    let query = 'SELECT id, name, email, address, role FROM users';
    const queryParams = [];
    const conditions = [];

    // Add filter conditions if provided
    if (name) {
      queryParams.push(`%${name}%`);
      conditions.push(`name ILIKE $${queryParams.length}`);
    }
    if (email) {
      queryParams.push(`%${email}%`);
      conditions.push(`email ILIKE $${queryParams.length}`);
    }
    if (address) {
      queryParams.push(`%${address}%`);
      conditions.push(`address ILIKE $${queryParams.length}`);
    }
    if (role) {
      queryParams.push(role);
      conditions.push(`role = $${queryParams.length}`);
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    const sortField = req.query.sort_by || 'name';
    const sortOrder = req.query.sort_order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const users = await pool.query(query, queryParams);
    res.json(users.rows);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is a store owner, get their store's rating
    if (user.rows[0].role === 'store_owner') {
      const storeRating = await pool.query(
        'SELECT AVG(r.rating)::numeric(10,2) as average_rating FROM stores s JOIN ratings r ON s.id = r.store_id WHERE s.owner_id = $1',
        [id]
      );
      user.rows[0].average_rating = storeRating.rows[0]?.average_rating || 0;
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error getting user by ID:', err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError, field: 'newPassword' });
    }
    
    // Get current user
    const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect', field: 'currentPassword' });
    }
    
    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

module.exports = { addUser, getUsers, getUserById, updatePassword };