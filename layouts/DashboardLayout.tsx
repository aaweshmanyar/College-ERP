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
    <div className="flex h-screen bg-gray-100 overflow-hidden" role="application">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto" role="main" aria-label="Dashboard content">
          {/* Error boundary placeholder */}
          <div className="min-h-full">
            {children || (
              <div className="text-center text-gray-500">
                <p>No content available.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
