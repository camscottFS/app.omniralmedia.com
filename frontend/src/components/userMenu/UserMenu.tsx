import React, { useState } from 'react';
import { isAdmin } from '../../utils/isAdmin';
import { UserType } from '../../utils/types/UserType';
import { getGravatarUrl } from '../../utils/getGravatarUrl';
import Avatar from '../avatar/Avatar';

interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Button to toggle dropdown */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden md:flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
      >
        <Avatar user={user} size="small" />
        {user.firstName} {user.lastName}
      </button>

      {/* Dropdown menu */}
      {(isHovered || isHovered) && (
        <div
          className="absolute right-0 w-48 bg-white rounded-lg shadow-lg z-10 border-solid border-2 border-blue-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
            onClick={() => {
              setIsHovered(false);
              onLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 text-center hover:bg-blue-800 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
