import React, { useState } from 'react';

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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Update Ticket Status</h2>
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
            <button
              className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketProgress;
