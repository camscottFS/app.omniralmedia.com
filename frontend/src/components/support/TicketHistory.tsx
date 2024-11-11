import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Message from '../message/Message';
import BarLoading from '../loading/BarLoading'
import { TicketType } from '../../utils/types/TicketType';

interface TicketHistoryProps {
  userId: number | undefined;
}

const TicketHistory: React.FC<TicketHistoryProps> = ({ userId }) => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all tickets for the user
  const fetchTickets = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/support/tickets/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setTickets(response.data.tickets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError('User ID not provided.');
      setLoading(false);
      return;
    }

    fetchTickets();
  }, [userId]);

  if (loading) {
    return <BarLoading />;
  }

  return (
    <div>
      {tickets.length === 0 ? (
        <p>You haven't created any tickets yet.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Ticket ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 capitalize">{ticket.status}</td>
                <td className="border border-gray-300 px-4 py-2">{ticket.id}</td>
                <td className="border border-gray-300 px-4 py-2"><a href={`/support/ticket/${ticket.id}`}>{ticket.subject}</a></td>
                <td className="border border-gray-300 px-4 py-2">{new Date(ticket.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketHistory;
