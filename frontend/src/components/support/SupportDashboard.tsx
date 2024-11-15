import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import AnchorLink from '../anchorLink/AnchorLink';
import axios from 'axios';
import TicketProgress from './TicketProgress';
import { formatDate } from '../../utils/formatDate';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

interface SupportDashboardProps {
  user: UserType | null | undefined;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ user }) => {
  const [tickets, setTickets] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/support/tickets`,
        {
          userId: user?.id,
        },
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
    fetchTickets();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl text-blue-900 mb-8">All open tickets</h1>
      <div className="flex border rounded-md overflow-hidden w-max mb-4">
        <button
          className={`flex items-center px-4 py-2 border-r text-sm font-medium bg-white text-gray-500 border-gray-300 hover:bg-gray-100`}
        //onClick={() => setChartSelection('progress')}
        >
          <span className="mr-2"><SunIcon className="h-4 text-blue-800" /></span> Show open tickets
        </button>
        <button
          className={`flex items-center px-4 py-2 border-r text-sm font-medium bg-white text-gray-500 border-gray-300 hover:bg-gray-100`}
        //onClick={() => setChartSelection('hours')}
        >
          <span className="mr-2"><MoonIcon className="h-4 text-blue-800" /></span> Show closed tickets
        </button>
      </div>
      <table className="border-collapse table-auto w-full text-sm">
        <thead className="text-left">
          <tr className="border-b border-blue-900 text-blue-900">
            <th className="py-4">Request Type</th>
            <th className="py-4">ID</th>
            <th className="py-4">Summary</th>
            <th className="py-4">Client</th>
            <th className="py-4">Assignee</th>
            <th className="py-4">Status</th>
            <th className="py-4">Created At</th>
            <th className="py-4">Time to Resolution</th>
            <th className="py-4">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket: any) => (
            <tr className="border-b border-blue-900" key={ticket.id}>
              <td className="py-4 capitalize">{ticket.category}</td>
              <td className="py-4 font-semibold"><AnchorLink to={`/support/ticket/${ticket.id}`} text={ticket.id} /></td>
              <td className="py-4">{ticket.subject}</td>
              <td className="py-4">{ticket.client}</td>
              <td className="py-4">{ticket.supportUser ? ticket.supportUser : null}</td>
              <td className="py-4">
                <TicketProgress status={ticket.status} />
              </td>
              <td className="py-4">{formatDate(ticket.createdAt, undefined, true)}</td>
              <td className="py-4">TBD</td>
              <td className="py-4 capitalize">{ticket.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SupportDashboard;