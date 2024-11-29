const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

router.post('/tickets/:ticketId/comments', auth, async (req, res) => {
  const { ticketId } = req.params;
  const { userId, comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment cannot be empty.', success: false });
  }

  try {
    // Check if the ticket exists
    const [ticketResult] = await db.query('SELECT * FROM supportTickets WHERE id = ?', [ticketId]);
    if (ticketResult.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    // Insert the comment into the supportTicketComments table
    const [result] = await db.query(
      `INSERT INTO supportTicketComments (ticketId, userId, comment, createdAt) VALUES (?, ?, ?, ?)`,
      [ticketId, userId, comment, new Date()]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({
        message: 'Comment added successfully.',
        success: true,
        comment: {
          id: result.insertId,
          ticketId,
          userId: req.user.id,
          comment,
          createdAt: new Date(),
        },
      });
    } else {
      res.status(500).json({ message: 'Failed to add comment.', success: false });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

router.post('/tickets/:ticketId/comments/delete/:commentId', auth, async (req, res) => {
  const { ticketId, commentId } = req.params;

  if (!ticketId || !commentId) {
    return res.status(400).json({ message: 'Please provide all required fields', success: false });
  }

  try {
    // Check if the comment exists
    const [commentResult] = await db.query('SELECT * FROM supportTicketComments WHERE id = ? AND ticketId = ?', [commentId, ticketId]);
    if (commentResult.length === 0) {
      return res.status(404).json({ message: 'Comment not found.', success: false });
    }

    // Delete the comment from the supportTicketComments table
    const [result] = await db.query(
      `DELETE FROM supportTicketComments WHERE ticketId = ? AND id = ?`,
      [ticketId, commentId]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({
        message: 'Comment deleted successfully.',
        success: true,
      });
    } else {
      res.status(500).json({ message: 'Failed to delete comment.', success: false });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

module.exports = router;
