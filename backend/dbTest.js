const pool = require('./config/db');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful!');
    
    // Check test user existence
    const res = await client.query(
      'SELECT * FROM users WHERE email = $1', 
      ['testuser@example.com']
    );
    
    console.log('User exists:', res.rows.length > 0);
    
    if (res.rows[0]) {
      // Compare stored hash with sample hash
      const match = await bcrypt.compare('Test@1234', res.rows[0].password);
      console.log('Password match:', match);
      
      // Generate fresh hash for comparison
      const newHash = bcrypt.hashSync('Test@1234', 10);
      console.log('New hash:', newHash);
    }
    
    client.release();
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    process.exit();
  }
})();