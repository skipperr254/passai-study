import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { useAuth } from '../common/AuthContext';

export const AuthenticatedApp = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render AppShell which will handle the layout and nested routes via Outlet
  return <AppShell userName={user?.name} />;
};
