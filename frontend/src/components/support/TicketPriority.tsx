import React, { useState } from 'react';
import Modal from '../modal/Modal';

interface TicketPriorityProps {
  priority: string;
  ticketId: number;
  onUpdateStatus: (priority: string, newStatus: string, ticketId: number) => void;
}

const priorityOptions = [
  { value: 'low', text: 'Low' },
  { value: 'medium', text: 'Medium' },
  { value: 'high', text: 'High' },
  { value: 'critical', text: 'Critical' },
];

const TicketPriority: React.FC<TicketPriorityProps> = ({ priority, ticketId, onUpdateStatus }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleStatusChange = (type: string, newStatus: string, ticketId: number) => {
    onUpdateStatus(type, newStatus, ticketId);
    setModalOpen(false);
  };

  return (
    <div>
      <span
        className="uppercase py-1 px-2 bg-blue-800 text-white rounded-sm cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        {priority}
      </span>
      {isModalOpen && (
        <Modal
          title="Update Ticket Priority"
          setModalOpen={setModalOpen}
        >
          <ul className="space-y-2">
            {priorityOptions.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full text-left py-2 px-4 ${option.value === priority ? 'bg-gray-500' : 'bg-blue-800'} uppercase text-white`}
                  onClick={() => handleStatusChange('priority', option.value, ticketId)}
                  disabled={option.value === priority}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  )
}

export default TicketPriority;