const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      `
      SELECT users.*, clients.clientId
      FROM users
      LEFT JOIN clients ON users.id = clients.userId
      WHERE users.email = ?
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password', success: false });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password', success: false });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        clientId: user.clientId || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, success: true });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
