"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../modules/admin/components/Sidebar'; // Adjust the path as needed

const ClientSidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Sidebar />}
      {children}
    </>
  );
};

export default ClientSidebarWrapper;