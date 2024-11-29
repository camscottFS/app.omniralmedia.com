const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/checkRole');

router.post('/tickets', auth, checkRole(3), async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Please provide a user ID.', success: false });
  }

  try {
    const [tickets] = await db.query(`
      SELECT 
        supportTickets.*, 
        CONCAT(u1.firstName, ' ', u1.lastName) AS client,
        CONCAT(u2.firstName, ' ', u2.lastName) AS supportUser
      FROM supportTickets
      JOIN users AS u1 ON supportTickets.userId = u1.id
      LEFT JOIN users AS u2 ON supportTickets.supportUserId = u2.id
    `);

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found.', success: false });
    }

    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

router.get('/ticket/user/:userId', auth, async (req, res) => {
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

router.get('/tickets/:ticketId', auth, async (req, res) => {
  const { ticketId } = req.params;

  if (!ticketId) {
    return res.status(400).json({ message: 'Please provide a ticket ID.', success: false });
  }

  try {
    // Query to fetch the ticket details
    const [ticketResult] = await db.query(
      `SELECT 
        t.*, 
        CONCAT(u.firstName, ' ', u.lastName) AS createdBy 
      FROM supportTickets t
      INNER JOIN users u ON t.userId = u.id
      WHERE t.id = ?`,
      [ticketId]
    );

    if (ticketResult.length === 0) {
      return res.status(404).json({ message: 'Ticket not found.', success: false });
    }

    const ticket = ticketResult[0]; // Extract the ticket details

    // Query to fetch the comments for the ticket
    const [comments] = await db.query(
      `SELECT c.id, c.comment, c.createdAt, CONCAT(u.firstName, ' ', u.lastName) AS sender, u.roleId
      FROM supportTicketComments c
      INNER JOIN users u ON c.userId = u.id
      WHERE c.ticketId = ? 
      ORDER BY c.createdAt DESC`,
      [ticketId]
    );

    // Transform the comments into the desired format
    const messages = comments.map((comment) => ({
      id: comment.id,
      sender: comment.sender,
      timestamp: comment.createdAt,
      content: comment.comment,
      isSupport: comment.roleId === 1 || comment.roleId === 3,
    }));

    // Add messages to the ticket object
    ticket.messages = messages;

    res.status(200).json({ ticket, success: true });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error.', success: false });
  }
});

module.exports = router;
