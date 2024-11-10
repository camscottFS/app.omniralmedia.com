import React, { useEffect } from 'react';
import { UserType } from '../../utils/types/UserType';

interface SupportProps {
  user: UserType | null | undefined;
}

const Support: React.FC<SupportProps> = ({ user }) => {
  useEffect(() => {
    document.title = `${process.env.REACT_APP_COMPANY} -  Client Support`;
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl text-blue-900 mb-8">{process.env.REACT_APP_COMPANY_SHORT} Client Support</h1>
      <div className="mb-8">
        <div className="bg-blue-800 text-white p-4 rounded-tl-lg rounded-tr-lg">
          <h2>
            Emergency Ticket
          </h2>
        </div>
        <div className="p-4 shadow-lg rounded-bl-lg rounded-br-lg pb-6">
          <p className="mb-6">24/7: The fastest way to escalate incidents to our experts for downtime diagnosis and site restoration. Guaranteed response within 15 minutes.</p>
          <a href="#" className="py-2 px-4 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" target="_blank" rel="noreferrer">Open emergency ticket</a>
        </div>
      </div>
      <div className="mb-8">
        <div className="bg-blue-800 text-white p-4 rounded-tl-lg rounded-tr-lg">
          <h2>
            General Support Ticket
          </h2>
        </div>
        <div className="p-4 shadow-lg rounded-bl-lg rounded-br-lg pb-6">
          <p className="mb-6">24/7: Efficiently resolve issues and ensure team-wide visibility. Count on our guaranteed 1-hour response time.</p>
          <a href="#" className="py-2 px-4 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" target="_blank" rel="noreferrer">Open support ticket</a>
        </div>
      </div>
      <h1 className="text-2xl text-blue-900 mb-8">Ticket History</h1>
    </div>
  )
}

export default Support;