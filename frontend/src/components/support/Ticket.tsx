import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import BarLoading from '../loading/BarLoading';
import axios from 'axios';
import { TicketType } from '../../utils/types/TicketType';
import { useParams } from 'react-router-dom';
import TicketCommentForm from './TicketCommentForm';
import AnchorLink from '../anchorLink/AnchorLink';
import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/solid';

interface TicketProps {
  user: UserType | null | undefined;
}

const Ticket: React.FC<TicketProps> = ({ user }) => {
  const [ticket, setTicket] = useState<TicketType>({} as TicketType);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ticketId = useParams().ticketId;

  // Fetch all tickets for the user
  const fetchTicket = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/support/ticket/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setTicket(response.data.ticket);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [user]);

  const messages = [
    {
      id: 1,
      sender: 'Cameron Scott (omniral Support)',
      timestamp: '10/22/2024 at 10:24 AM',
      content:
        "Thanks for reaching out to Pantheon support. Appservers are not permanent and can be regularly rotated as part of normal platform maintenance. Is there something specific you are trying to automate? Some of this might be possible via Terminus.\n\nThanks, Matthew Staff Customer Success Engineer Pantheon",
      isSupport: true,
    },
    {
      id: 2,
      sender: 'Cameron Scott (You)',
      timestamp: '10/22/2024 at 10:20 AM',
      content:
        "Hello!\n\nWe are wondering if these are permanent for our environments as we have to setup specific access to the environments for our own additional backup configuration.\n\nFor example, KSTP live has this appserver URI:\n\nappserver.live.ae32fbf8-9f12-4165-a54b-18a999778ea3.drush.in\n\nIs this ever going to change again or will it stay that way permanently unless we requested some sort of change?\n\nThanks,",
      isSupport: false,
    },
  ];

  if (loading) {
    return <BarLoading />;
  }

  return (
    <div>
      <div className="lg:w-1/2 md:w-full">
        <AnchorLink to="/support" text="Go back" icon={<ArrowTurnDownLeftIcon className="h-5 w-5" />} />
        <h1 className="text-3xl text-blue-900 mb-8 mt-4">{ticket.subject}</h1>
        <TicketCommentForm />
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 p-4 rounded-lg shadow-md ${message.isSupport ? 'bg-white' : 'bg-blue-100'
                }`}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`w-10 h-10 rounded-full ${message.isSupport ? 'bg-gray-200' : 'bg-blue-500'
                    } flex items-center justify-center text-white font-bold`}
                >
                  {message.isSupport ? 'M' : 'C'}
                </div>
                <div className="ml-3">
                  <p
                    className={`font-semibold ${message.isSupport ? 'text-gray-800' : 'text-blue-800'
                      }`}
                  >
                    {message.sender}
                  </p>
                  <p className="text-sm text-gray-500">{message.timestamp}</p>
                </div>
              </div>
              <div className="text-gray-800 whitespace-pre-line">{message.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ticket;