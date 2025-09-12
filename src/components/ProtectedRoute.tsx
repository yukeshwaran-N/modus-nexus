// File: src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../context/useAuth';
import LoginPage from './LoginPage';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, authChecked } = useAuth();

  // Show loading spinner until auth check is complete
  if (loading || !authChecked) {
    return <LoadingSpinner />;
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;