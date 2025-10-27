import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { users } from '../data/seedData';
import { UserRole } from '../types';
import Modal from '../components/common/Modal';
import FeaturesShowcase from '../components/common/FeaturesShowcase';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      login(parseInt(selectedUserId, 10));
    }
  };

  const usersForRole = useMemo(() => {
    const filteredUsers = users.filter(user => user.role === selectedRole);
    if (filteredUsers.length > 0) {
      setSelectedUserId(String(filteredUsers[0].id));
    } else {
      setSelectedUserId('');
    }
    return filteredUsers;
  }, [selectedRole]);
  
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">School Management System</h1>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">User</label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={usersForRole.length === 0}
                className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {usersForRole.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={!selectedUserId}
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="pt-4 border-t border-gray-200">
             <button
                type="button"
                onClick={() => setIsFeaturesModalOpen(true)}
                className="w-full text-center py-2 text-sm font-medium text-indigo-600 bg-transparent rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Know more about our system
            </button>
          </div>
        </div>
      </div>
      
      {isFeaturesModalOpen && (
          <Modal title="System Features Overview" onClose={() => setIsFeaturesModalOpen(false)} size="4xl">
              <FeaturesShowcase />
          </Modal>
      )}
    </>
  );
};

export default LoginPage;