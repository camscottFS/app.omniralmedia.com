const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/checkRole');

router.post('/register', auth, checkRole(1), async (req, res) => {
  const { firstName, lastName, username, email, password, roleId } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Please provide all required fields', success: false });
    }

    // Check if user already exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email or username already exists', success: false });
    }

    // Hash the password
    const saltRounds = 4;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const date = new Date();

    // Insert the new user into the database
    const [result] = await db.query(
      'INSERT INTO users (firstName, lastName, username, email, password, roleId, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, username, email, hashedPassword, roleId, 1, date, date]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId, success: true });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
