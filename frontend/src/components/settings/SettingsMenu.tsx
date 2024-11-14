import React from 'react';

const SettingsMenu: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-200 p-4">
      <a className="block w-full mb-3" href="/settings/profile">
        Profile
      </a>
      <a className="block w-full" href="/settings/profile">
        Login & Security
      </a>
    </div>
  )
}

export default SettingsMenu;