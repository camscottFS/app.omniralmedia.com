import React from 'react';
import { UserType } from '../../utils/types/UserType';

interface SupportAssigneeProps {
  user: UserType | null | undefined;
  supportUser: string;
  supportUserId: number;
}

const SupportAssignee: React.FC<SupportAssigneeProps> = ({ user, supportUser, supportUserId }) => {
  const assignTicket = () => {
    console.log('Assigning to user:', user);
  };

  const tooltipText = supportUserId === user?.id
    ? 'Unassign ticket'
    : supportUser
      ? 'Take over ticket'
      : 'Assign to me';

  return (
    <div className="relative group inline-block">
      {supportUserId === user?.id ? (
        <span
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          data-tooltip="Unassign ticket"
        >
          You
        </span>
      ) : supportUser ? (
        <span
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          data-tooltip="Take over ticket"
        >
          {supportUser}
        </span>
      ) : (
        <button
          className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm"
          onClick={assignTicket}
        >
          None
        </button>
      )}
      <span
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 bg-gray-800 text-white text-sm px-2 py-1 rounded-md shadow-md group-hover:opacity-100 transition-opacity w-max"
      >
        {tooltipText}
      </span>
    </div>
  );
};

export default SupportAssignee;
