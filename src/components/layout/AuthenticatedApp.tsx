import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { useAuth } from '../common/AuthContext';

export const AuthenticatedApp = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to signin if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/signin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render AppShell which will handle the layout and nested routes via Outlet
  return <AppShell userName={user?.name} />;
};
