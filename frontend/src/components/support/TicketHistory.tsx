import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Message from '../message/Message';
import BarLoading from '../loading/BarLoading';
import { TicketType } from '../../utils/types/TicketType';
import AnchorLink from '../anchorLink/AnchorLink';
import { formatDate } from '../../utils/formatDate';

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
        `${process.env.REACT_APP_API_HOST}/support/ticket/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedTickets = response.data.tickets.sort(
        (a: TicketType, b: TicketType) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setTickets(sortedTickets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
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
      {error && <Message type="error" message={error} />}
      {tickets.length === 0 ? (
        <p>You haven't created any tickets yet.</p>
      ) : (
        <table className="table-fixed w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="border-b text-blue-900 text-left">
              <th className="px-4 py-2 font-semibold text-left">Status</th>
              <th className="px-4 py-2 font-semibold text-left">Ticket ID</th>
              <th className="px-4 py-2 font-semibold text-left">Subject</th>
              <th className="px-4 py-2 font-semibold text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 capitalize flex items-center">
                  {ticket.status === 'in progress' && (
                    <div className="h-5 w-5 rounded-full bg-blue-800 mr-2" />
                  )}
                  {ticket.status === 'wfs' && (
                    <div className="h-5 w-5 rounded-full bg-orange-600 mr-2" />
                  )}
                  {ticket.status === 'resolved' && (
                    <div className="h-5 w-5 rounded-full bg-green-600 mr-2" />
                  )}
                  {ticket.status === 'wfs' ? 'Waiting for support' : ticket.status}
                </td>
                <td className="px-4 py-2">
                  <AnchorLink to={`/support/ticket/${ticket.id}`} text={ticket.id.toString()} />
                </td>
                <td className="px-4 py-2">
                  <AnchorLink to={`/support/ticket/${ticket.id}`} text={ticket.subject} />
                </td>
                <td className="px-4 py-2">{formatDate(ticket.updatedAt, 'en', true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketHistory;
