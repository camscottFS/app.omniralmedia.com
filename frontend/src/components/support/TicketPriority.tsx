import React from 'react';

interface TicketPriorityProps {
  priority: string;
}

const TicketPriority: React.FC<TicketPriorityProps> = ({ priority }) => {
  return (
    <span className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm">
      {priority}
    </span>
  )
}

export default TicketPriority;