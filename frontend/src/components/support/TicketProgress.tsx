import React, { useState } from 'react';
import Modal from '../modal/Modal';

interface TicketProgressProps {
  status: string;
  onUpdateStatus: (newStatus: string) => void;
}

const statusOptions = [
  { value: 'wfs', text: 'Waiting for Support', color: 'bg-orange-600' },
  { value: 'in progress', text: 'In Progress', color: 'bg-blue-800' },
  { value: 'resolved', text: 'Resolved', color: 'bg-green-600' },
];

const statusMap: Record<string, { text: string; className: string }> = {
  'wfs': {
    text: 'Waiting for Support',
    className: 'uppercase py-1 px-2 bg-orange-600 text-white rounded-sm cursor-pointer',
  },
  'in progress': {
    text: 'In Progress',
    className: 'uppercase py-1 px-2 bg-blue-800 text-white rounded-sm cursor-pointer',
  },
  'resolved': {
    text: 'Resolved',
    className: 'uppercase py-1 px-2 bg-green-600 text-white rounded-sm cursor-pointer',
  },
};

const TicketProgress: React.FC<TicketProgressProps> = ({ status, onUpdateStatus }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const statusInfo = statusMap[status];

  if (!statusInfo) return null;

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(newStatus);
    setModalOpen(false);
  };

  return (
    <div>
      <span
        className={`${statusInfo.className} inline-block`}
        onClick={() => setModalOpen(true)}
      >
        {statusInfo.text}
      </span>

      {isModalOpen && (
        <Modal
          title="Update Ticket Status"
          setModalOpen={setModalOpen}
        >
          <ul className="space-y-2">
            {statusOptions.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full text-left py-2 px-4 ${option.color} uppercase text-white`}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={option.value === status}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default TicketProgress;
