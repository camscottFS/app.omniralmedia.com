const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

router.get('/tickets/:userId', auth, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'Please provide a user ID.', success: false });
  }

  try {
    // Query to fetch all tickets for the user
    const [tickets] = await db.query('SELECT * FROM supportTickets WHERE userId = ?', [userId]);

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this user.', success: false });
    }

    res.status(200).json({ tickets, success: true });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

router.get('/ticket/:ticketId', auth, async (req, res) => {
  const { ticketId } = req.params;

  if (!ticketId) {
    return res.status(400).json({ message: 'Please provide a ticket ID.', success: false });
  }

  try {
    // Query to fetch a single ticket by ticketId
    const [ticket] = await db.query('SELECT * FROM supportTickets WHERE id = ?', [ticketId]);

    if (ticket.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    res.status(200).json({ ticket: ticket[0], success: true });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

module.exports = router;
