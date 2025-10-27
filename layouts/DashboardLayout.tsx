
import React, { ReactNode } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
