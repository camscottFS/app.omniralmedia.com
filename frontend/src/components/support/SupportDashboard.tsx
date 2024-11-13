import React from 'react';
import { UserType } from '../../utils/types/UserType';

interface SupportDashboardProps {
  user: UserType | null | undefined;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ user }) => {
  return (
    <div>SupportDashboard</div>
  )
}

export default SupportDashboard;