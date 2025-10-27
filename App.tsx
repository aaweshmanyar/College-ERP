
import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {user ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

export default App;
