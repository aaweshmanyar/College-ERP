
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { users } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  login: (userId: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userId: number) => {
    const userToLogin = users.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
    } else {
      console.error("User not found");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
