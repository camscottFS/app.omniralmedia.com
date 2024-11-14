import React from 'react';
import { UserType } from '../../utils/types/UserType';
import SettingsMenu from './SettingsMenu';
import Button from '../button/Button';

interface SettingsLoginSecurityProps {
  user: UserType | null | undefined;
}

const SettingsLoginSecurity: React.FC<SettingsLoginSecurityProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-6 gap-5">
      <div className="col-span-1">
        <SettingsMenu />
      </div>
      <div className="col-span-3">
        <div className="rounded-lg bg-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-4">Email Address</h2>
            <form className="space-y-4 mt-4">
              <div>
                <input
                  type="text"
                  id="email"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  value={user?.email}
                  required
                />
              </div>
              <Button text="Change email" />
            </form>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Password</h2>
            <form className="space-y-4 mt-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your current password"
                  // value={user?.firstName}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  // value={user?.firstName}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  // value={user?.firstName}
                  required
                />
              </div>
              <Button text="Save changes" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLoginSecurity;
