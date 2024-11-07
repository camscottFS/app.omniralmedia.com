import React, { useState } from 'react';
import { isAdmin } from '../../utils/isAdmin';
import { UserType } from '../../utils/types/UserType';

interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
      >
        {user.firstName} {user.lastName}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border-solid border-2 border-blue-800">
          <a
            href="/settings"
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
          )
          }
          <button
            onClick={() => {
              setIsOpen(false);
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
