import React from 'react';

interface TicketProgressProps {
  status: string;
}

const statusMap: Record<string, { text: string; className: string }> = {
  'wfs': {
    text: 'Waiting for Support',
    className: 'uppercase py-1 px-2 bg-orange-600 text-white rounded-sm',
  },
  'resolved': {
    text: 'Resolved',
    className: 'uppercase py-1 px-2 bg-green-500 text-white rounded-sm',
  },
  'in progress': {
    text: 'In Progress',
    className: 'uppercase py-1 px-2 bg-blue-800 text-white rounded-sm',
  }
};

const TicketProgress: React.FC<TicketProgressProps> = ({ status }) => {
  const statusInfo = statusMap[status];

  if (!statusInfo) return null;

  return (
    <span className={statusInfo.className}>{statusInfo.text}</span>
  );
};

export default TicketProgress;
