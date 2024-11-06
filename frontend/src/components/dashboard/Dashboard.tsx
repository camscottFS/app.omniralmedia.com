import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Omniral Media - Dashboard";
    if (!user) navigate('/');
  }, []);

  return (
    <>
      <div>{user?.username}</div>
      <div>{user?.email}</div>
      <div>{user?.firstName}</div>
      <div>{user?.lastName}</div>
    </>
  )
}

export default Dashboard;