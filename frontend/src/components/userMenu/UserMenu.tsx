import React, { useState } from 'react';
import { isAdmin } from '../../utils/isAdmin';
import { UserType } from '../../utils/types/UserType';
import { getGravatarUrl } from '../../utils/getGravatarUrl';
import Avatar from '../avatar/Avatar';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer bg-blue-800 py-2 px-3 rounded-md text-white">
        <Avatar user={user} size="small" />
        {user.firstName} {user.lastName}
        <ChevronDownIcon className="h-4 ml-2" />
      </div>
      <div className="absolute hidden group-hover:block right-0 z-10 pt-3 w-[200px] origin-top-right">
        <div className="py-1 bg-white rounded-md shadow-lg text-sm ring-1 ring-black/5 text-center">
          <a
            href="/settings/profile"
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 text-center hover:bg-blue-800 hover:text-white transition-colors"
          >
            Settings
          </a>
          {isAdmin(user) && (
            <a
              href="/users/add"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 text-center hover:bg-blue-800 hover:text-white transition-colors"
            >
              Add User
            </a>
          )}
          <button
            onClick={() => { onLogout(); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 text-center hover:bg-blue-800 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
