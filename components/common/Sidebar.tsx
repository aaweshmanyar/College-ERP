import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION_LINKS } from '../../constants';
import { SchoolIcon } from '../icons/Icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const links = NAVIGATION_LINKS[user.role];

  return (
    <aside className="flex flex-col w-64 bg-gray-800 text-gray-100">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <SchoolIcon />
        <h1 className="ml-2 text-2xl font-bold">SMS</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {/* FIX: The `NAVIGATION_LINKS` constant now provides component functions for icons.
              The icon is destructured and aliased to `Icon` (with a capital letter) to be used as a JSX component. */}
          {links.map(({ name, icon: Icon }) => (
            <li key={name}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(name);
                }}
                className={`flex items-center px-4 py-3 my-1 rounded-md transition-colors duration-200 ${
                  activeView === name
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon />
                <span className="ml-4">{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
