import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';
import ClientSidebarWrapper from './ClientSidebarWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <ClientSidebarWrapper>{children}</ClientSidebarWrapper>
        </body>
      </html>
    </AuthProvider>
  );
}
