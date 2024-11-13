import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../utils/types/UserType';
import Projects from '../projects/Projects';
import Invoices from '../invoices/Invoices';
import SupportDashboard from '../support/SupportDashboard';

interface DashboardProps {
  user: UserType | null | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Omniral Media - Dashboard";
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      {/* Client User */}
      {user.roleId === 2 && (
        <>
          <div>
            <Projects user={user} />
          </div>
          <div className="mt-8">
            <Invoices user={user} />
          </div>
        </>
      )}
      {/* Support User */}
      {user.roleId === 3 && (
        <SupportDashboard user={user} />
      )}
    </>
  )
}

export default Dashboard;