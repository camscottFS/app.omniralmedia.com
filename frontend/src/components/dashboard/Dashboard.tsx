import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../utils/types/UserType';

interface DashboardProps {
  user: UserType | null;
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
      <div>{user.username}</div>
      <div>{user.email}</div>
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
    </>
  )
}

export default Dashboard;