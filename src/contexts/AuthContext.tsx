import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Usuario } from '@/services/api';

interface AuthContextType {
  user: Usuario | null;
  login: (user: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('newera_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('newera_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('newera_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
