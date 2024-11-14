import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import SettingsMenu from './SettingsMenu';
import AnchorLink from '../anchorLink/AnchorLink';
import Button from '../button/Button';
import { getGravatarUrl } from '../../utils/getGravatarUrl';
import Avatar from '../avatar/Avatar';

interface SettingsProfileProps {
  user: UserType | null | undefined;
}

const SettingsProfile: React.FC<SettingsProfileProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-6 gap-5">
      <div className="col-span-1">
        <SettingsMenu />
      </div>
      <div className="col-span-3">
        <div className="rounded-lg bg-gray-200 p-4">
          <h2 className="text-lg font-bold mb-4">Basic Information</h2>
          <div className="flex items-center mb-4">
            <Avatar user={user} size="large" />
            <div>
              <p>We use Gravatar, a service that associates an avatar image with your email address. <AnchorLink to="https://gravatar.com/" text="Change your Gravatar" blank={true} />.</p>
            </div>
          </div>
          <form className="space-y-4 mt-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                value={user?.firstName}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
                value={user?.lastName}
                required
              />
            </div>
            <Button text="Save Changes" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
