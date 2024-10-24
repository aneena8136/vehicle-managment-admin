"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('authToken'); // Check if the token exists
  });

  const login = (token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token); // Save the token in local storage
  };
  const logout = () => {
    setIsAuthenticated(false);
    // If you're using any tokens or local storage, clear them here
    localStorage.removeItem('authToken'); // Example: remove auth token from local storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};