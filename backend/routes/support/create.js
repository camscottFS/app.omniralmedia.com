const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

router.post('/create', auth, async (req, res) => {
  const { userId, projectId, category, subject, description } = req.body;

  try {
    // Validate required fields
    if (!userId || !subject || !description) {
      return res.status(400).json({ message: 'Please provide all required fields', success: false });
    }

    const date = new Date();

    // Insert the new support ticket into the database
    const [result] = await db.query(
      'INSERT INTO supportTickets (userId, projectId, category, subject, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, projectId, category, subject, description, 1, date, date]
    );

    res.status(201).json({ message: 'Support ticket created successfully', ticketId: result.insertId, success: true });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

module.exports = router;