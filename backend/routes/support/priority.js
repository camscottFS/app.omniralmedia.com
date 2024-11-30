const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

router.post('/tickets/:ticketId/priority', auth, async (req, res) => {
  const { ticketId } = req.params;
  const { priority } = req.body;

  try {
    // Check if the ticket exists
    const [ticketResult] = await db.query('SELECT * FROM supportTickets WHERE id = ?', [ticketId]);
    if (ticketResult.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    // Update the priority field in the supportTickets table
    const [updateResult] = await db.query(
      'UPDATE supportTickets SET priority = ? WHERE id = ?',
      [priority, ticketId]
    );

    if (updateResult.affectedRows === 1) {
      res.status(200).json({
        message: 'Ticket priority updated successfully.',
        success: true,
        ticket: {
          id: ticketId,
          priority: priority,
        },
      });
    } else {
      res.status(500).json({ message: 'Failed to prioritize ticket.', success: false });
    }
  } catch (error) {
    console.error('Error prioritizing ticket:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

module.exports = router;
