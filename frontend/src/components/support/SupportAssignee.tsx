import React, { useState } from 'react';
import axios from 'axios';
import { UserType } from '../../utils/types/UserType';

interface SupportAssigneeProps {
  user: UserType | null | undefined;
  ticketId: number;
  supportUser: string;
  supportUserId: number;
}

const SupportAssignee: React.FC<SupportAssigneeProps> = ({ user, ticketId, supportUser, supportUserId }) => {
  const [loading, setLoading] = useState(false);
  const [currentSupportUser, setCurrentSupportUser] = useState(supportUser || null);
  const [currentSupportUserId, setCurrentSupportUserId] = useState(supportUserId || null);
  const token = sessionStorage.getItem('token');

  const assignOrUnassignTicket = async () => {
    if (!user || !user.id) {
      console.error('User is not logged in or invalid.');
      return;
    }

    setLoading(true);

    try {
      if (currentSupportUserId === user.id) {
        const response = await axios.post(`${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/unassign`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCurrentSupportUser(null);
          setCurrentSupportUserId(0);
        } else {
          console.error('Failed to unassign ticket:', response.data.message);
        }
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/assign`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCurrentSupportUser('You');
          setCurrentSupportUserId(user.id);
        } else {
          console.error('Failed to assign ticket:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error updating ticket assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const tooltipText =
    currentSupportUserId === user?.id
      ? 'Unassign ticket'
      : currentSupportUser
        ? 'Take over ticket'
        : 'Assign to me';

  return (
    <div className="relative group inline-block">
      {currentSupportUserId === user?.id ? (
        <button
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          onClick={assignOrUnassignTicket}
          disabled={loading}
        >
          {loading ? null : 'You'}
        </button>
      ) : currentSupportUser ? (
        <button
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          onClick={assignOrUnassignTicket}
          disabled={loading}
        >
          {loading ? null : currentSupportUser}
        </button>
      ) : (
        <button
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          onClick={assignOrUnassignTicket}
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'None'}
        </button>
      )}
      <span
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 bg-gray-800 text-white text-sm px-2 py-1 rounded-md shadow-md group-hover:opacity-100 transition-opacity w-max cursor-pointer"
      >
        <button
          onClick={assignOrUnassignTicket}
          disabled={loading}
        >
          {tooltipText}
        </button>
      </span>
    </div>
  );
};

export default SupportAssignee;
