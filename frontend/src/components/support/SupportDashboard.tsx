import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import AnchorLink from '../anchorLink/AnchorLink';
import axios from 'axios';
import TicketProgress from './TicketProgress';
import { formatDate } from '../../utils/formatDate';
import { ChevronLeftIcon, ChevronRightIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import SupportAssignee from './SupportAssignee';
import TicketPriority from './TicketPriority';

interface SupportDashboardProps {
  user: UserType | null | undefined;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ user }) => {
  const [tickets, setTickets] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOpenTickets, setShowOpenTickets] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 25;
  const token = sessionStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/support/tickets`,
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const onUpdateStatus = async (type: string, newStatus: string, ticketId: number) => {
    if (type === 'priority') {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/priority`,
          { priority: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        setError('Failed to update ticket priority. Please try again later.');
      }
    } else if (type === 'status') {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        setError('Failed to update ticket status. Please try again later.');
      }
    }
    fetchTickets();
  };

  const filteredTickets = tickets
    .filter((ticket: any) =>
      showOpenTickets
        ? ['wfs', 'in progress'].includes(ticket.status)
        : ticket.status === 'resolved'
    )
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by date, newest first

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const displayedTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="text-3xl text-blue-900 mb-8">All open tickets</h1>
      <div className="flex border rounded-md overflow-hidden w-max mb-4">
        <button
          className={`flex items-center px-4 py-2 border-r text-sm font-medium ${showOpenTickets ? 'bg-blue-200 text-blue-900' : 'bg-white text-gray-500'
            } border-gray-300 hover:bg-gray-100`}
          onClick={() => setShowOpenTickets(true)}
        >
          <span className="mr-2">
            <SunIcon className="h-4 text-blue-800" />
          </span>
          Show open tickets
        </button>
        <button
          className={`flex items-center px-4 py-2 border-r text-sm font-medium ${!showOpenTickets ? 'bg-blue-200 text-blue-900' : 'bg-white text-gray-500'
            } border-gray-300 hover:bg-gray-100`}
          onClick={() => setShowOpenTickets(false)}
        >
          <span className="mr-2">
            <MoonIcon className="h-4 text-blue-800" />
          </span>
          Show closed tickets
        </button>
      </div>
      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
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
              {displayedTickets.map((ticket: any) => (
                <tr className="border-b border-blue-900" key={ticket.id}>
                  <td className="py-4 capitalize">{ticket.category}</td>
                  <td className="py-4 font-semibold">
                    <AnchorLink to={`/support/ticket/${ticket.id}`} text={ticket.id} />
                  </td>
                  <td className="py-4">{ticket.subject}</td>
                  <td className="py-4">{ticket.client}</td>
                  <td className="py-4">
                    <SupportAssignee
                      user={user}
                      ticketId={ticket.id}
                      supportUser={ticket.supportUser}
                      supportUserId={ticket.supportUserId}
                    />
                  </td>
                  <td className="py-4">
                    <TicketProgress status={ticket.status} ticketId={ticket.id} onUpdateStatus={onUpdateStatus} />
                  </td>
                  <td className="py-4">{formatDate(ticket.createdAt, undefined, true)}</td>
                  <td className="py-4">TBD</td>
                  <td className="py-4">
                    <TicketPriority priority={ticket.priority} ticketId={ticket.id} onUpdateStatus={onUpdateStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className="px-3 py-1 bg-white text-blue-800 rounded hover:text-blue-700 disabled:cursor-default"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-6" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <div>
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${currentPage === index + 1
                    ? 'bg-blue-800 text-white hover:bg-blue-700'
                    : 'bg-blue-800 text-white hover:bg-blue-700'
                    }`}
                  onClick={() => changePage(index + 1)}
                >
                  {index + 1}
                </button>
              </div>
            ))}
            <button
              className="px-3 py-1 bg-white text-blue-800 rounded hover:text-blue-700 disabled:cursor-default"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-6" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SupportDashboard;
