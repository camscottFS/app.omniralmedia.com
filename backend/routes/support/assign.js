const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

router.post('/tickets/:ticketId/assign', auth, async (req, res) => {
  const { ticketId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the ticket exists
    const [ticketResult] = await db.query('SELECT * FROM supportTickets WHERE id = ?', [ticketId]);
    if (ticketResult.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    // Update the supportUserId field in the supportTickets table
    const [updateResult] = await db.query(
      'UPDATE supportTickets SET supportUserId = ? WHERE id = ?',
      [userId, ticketId]
    );

    if (updateResult.affectedRows === 1) {
      res.status(200).json({
        message: 'Ticket assigned successfully.',
        success: true,
        ticket: {
          id: ticketId,
          assignedTo: userId,
        },
      });
    } else {
      res.status(500).json({ message: 'Failed to assign ticket.', success: false });
    }
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

router.post('/tickets/:ticketId/unassign', auth, async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Check if the ticket exists
    const [ticketResult] = await db.query('SELECT * FROM supportTickets WHERE id = ?', [ticketId]);
    if (ticketResult.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    // Set supportUserId to NULL
    const [updateResult] = await db.query(
      'UPDATE supportTickets SET supportUserId = NULL WHERE id = ?',
      [ticketId]
    );

    if (updateResult.affectedRows === 1) {
      res.status(200).json({
        message: 'Ticket unassigned successfully.',
        success: true,
      });
    } else {
      res.status(500).json({ message: 'Failed to unassign ticket.', success: false });
    }
  } catch (error) {
    console.error('Error unassigning ticket:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

module.exports = router;
