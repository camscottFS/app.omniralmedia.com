import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import BarLoading from '../loading/BarLoading';
import axios from 'axios';
import { TicketType } from '../../utils/types/TicketType';
import { useNavigate, useParams } from 'react-router-dom';
import TicketCommentForm from './TicketCommentForm';
import AnchorLink from '../anchorLink/AnchorLink';
import { ArrowTurnDownLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { TicketMessageType } from '../../utils/types/TicketMessageType';
import { formatDate } from '../../utils/formatDate';
import { verifyUser } from '../../utils/verifyUser';

interface TicketProps {
  user: UserType | null | undefined;
}

const Ticket: React.FC<TicketProps> = ({ user }) => {
  const [ticket, setTicket] = useState<TicketType>({} as TicketType);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const ticketId = useParams().ticketId;

  // Fetch all tickets for the user
  const fetchTicket = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setTicket(response.data.ticket);
      document.title = `Omniral Media - Client Support - ${response.data.ticket.subject}`;
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/comments/delete/${commentId}`,
        { ticketId, commentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTicket();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again later.');
    }
  }

  const onCommentAdded = () => {
    fetchTicket();
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const decodedToken = verifyUser(token);

    if (!decodedToken) {
      sessionStorage.removeItem('token');
      navigate('/');
    }
    fetchTicket();
  }, [user]);

  if (loading) {
    return <BarLoading />;
  }

  if (!user) return null;

  return (
    <div>
      <div className="lg:w-1/2 md:w-full">
        {user.roleId !== 3 && <AnchorLink to="/support" text="Go back" icon={<ArrowTurnDownLeftIcon className="h-5 w-5" />} />}
        {user.roleId === 3 && <AnchorLink to="/dashboard" text="Go back" icon={<ArrowTurnDownLeftIcon className="h-5 w-5" />} />}
        <h1 className="text-3xl text-blue-900 mb-8 mt-4">{ticket.subject}</h1>
        {ticket.status !== 'resolved'
          ? (
            <TicketCommentForm userId={user.id} ticketId={ticket.id} onCommentAdded={onCommentAdded} />
          ) : (
            <div className="mb-6 p-4 rounded-lg shadow-md bg-orange-300">
              <p className="font-semibold">This ticket has been marked as resolved.</p>
              <p>Please create a new ticket if you need further assistance.</p>
            </div>
          )
        }
        <div className="max-w-4xl mx-auto">
          {ticket?.messages?.map((message: TicketMessageType) => (
            <div
              key={message.id}
              className={`mb-6 p-4 rounded-lg shadow-md ${message.isSupport ? 'bg-white' : 'bg-blue-100'
                }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${message.isSupport ? 'bg-gray-200' : 'bg-blue-500'
                    } flex items-center justify-center font-bold`}
                >
                  {message.sender.slice(0, 1)}
                </div>
                <div className="ml-3">
                  <p
                    className={`font-semibold ${message.isSupport ? 'text-gray-800' : 'text-blue-800'
                      }`}
                  >
                    {message.sender}
                    {message.isSupport && ` (${process.env.REACT_APP_COMPANY_SHORT} Support)`}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(message.timestamp, undefined, true)}</p>
                </div>
              </div>
              <div className="text-gray-800 whitespace-pre-line flex align-center justify-between">
                <div>
                  {message.content}
                </div>
                <div>
                  {user.roleId === 3 && message.isSupport && (
                    <TrashIcon
                      className="h-5 w-5 text-blue-800 hover:text-blue-900 cursor-pointer"
                      onClick={() => { deleteComment(message.id) }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="mb-6 p-4 rounded-lg shadow-md bg-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {ticket.createdBy.slice(0, 1)}
              </div>
              <div className="ml-3">
                <p className="text-blue-800 font-bold">
                  {ticket.createdBy}
                  {ticket.userId === user?.id && ' (You)'}
                </p>
                <p className="text-sm text-gray-500">{formatDate(ticket.createdAt, undefined, true)}</p>
              </div>
            </div>
            <div className="text-gray-800 whitespace-pre-line">{ticket.description}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket;