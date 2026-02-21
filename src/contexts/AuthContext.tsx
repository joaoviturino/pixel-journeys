import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Usuario } from '@/services/api';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const stored = localStorage.getItem('newera_user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('newera_token');
  });

  const login = useCallback((userData: Usuario, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('newera_user', JSON.stringify(userData));
    localStorage.setItem('newera_token', jwt);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('newera_user');
    localStorage.removeItem('newera_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
