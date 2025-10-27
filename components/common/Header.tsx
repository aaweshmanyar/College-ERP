
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogoutIcon } from '../icons/Icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-sm text-gray-500">Role: {user?.role}</p>
      </div>
      <button
        onClick={logout}
        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <LogoutIcon />
        <span className="ml-2">Logout</span>
      </button>
    </header>
  );
};

export default Header;
