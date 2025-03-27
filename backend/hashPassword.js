const bcrypt = require('bcryptjs');
const pool = require('./config/db');

// Sample test user credentials
const user = {
  name: 'Christopher Alexander Johnson',
  email: 'testuser@example.com',
  password: 'Test@1234',
  address: '123 Main Street, Springfield'
};

const createTestUser = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if user already exists
    const res = await client.query(
      'SELECT * FROM users WHERE email = $1', 
      [user.email]
    );
    
    if (res.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await client.query(
        'INSERT INTO users (name, email, password, address) VALUES ($1, $2, $3, $4)',
        [user.name, user.email, hashedPassword, user.address]
      );
      console.log('Test user created successfully');
    }
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating test user:', err);
  } finally {
    client.release();
    process.exit();
  }
};

createTestUser();