import React, { createContext, useContext, useState } from 'react';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (userData: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('apex_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: AdminUser) => {
    setAdmin(userData);
    localStorage.setItem('apex_admin_token', userData.token);
    localStorage.setItem('apex_admin_user', JSON.stringify(userData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('apex_admin_token');
    localStorage.removeItem('apex_admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: Boolean(admin) }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
