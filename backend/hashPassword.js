const bcrypt = require('bcryptjs');

const password = 'password123'; // Replace with your desired password
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed Password:', hashedPassword);