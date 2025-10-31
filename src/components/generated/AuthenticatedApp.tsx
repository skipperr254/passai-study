import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { SignUpPage } from './SignUpPage';
import { SignInPage } from './SignInPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { AppShell } from './AppShell';
import { AuthProvider, useAuth } from './AuthContext';
type AuthView = 'landing' | 'signup' | 'signin' | 'forgotpassword' | 'app' | 'profile' | 'settings';
const AuthenticatedAppContent = () => {
  const {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateUser
  } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>(isAuthenticated ? 'app' : 'landing');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignUp = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(data.name, data.email, data.password);
      setCurrentView('app');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignIn = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(data.email, data.password);
      setCurrentView('app');
    } catch (err) {
      setError('Invalid credentials. Use example@passia.study with password Example123');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    signOut();
    setCurrentView('landing');
  };
  const handleUpdateProfile = (data: any) => {
    updateUser(data);
  };

  // If authenticated and viewing landing/signup/signin, redirect to app
  React.useEffect(() => {
    if (isAuthenticated && ['landing', 'signup', 'signin', 'forgotpassword'].includes(currentView)) {
      setCurrentView('app');
    }
  }, [isAuthenticated, currentView]);

  // Render based on current view
  if (currentView === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentView('signup')} onSignIn={() => setCurrentView('signin')} />;
  }
  if (currentView === 'signup') {
    return <SignUpPage onSignUp={handleSignUp} onBackToLanding={() => setCurrentView('landing')} onGoToSignIn={() => setCurrentView('signin')} />;
  }
  if (currentView === 'signin') {
    return <SignInPage onSignIn={handleSignIn} onBackToLanding={() => setCurrentView('landing')} onGoToSignUp={() => setCurrentView('signup')} onForgotPassword={() => setCurrentView('forgotpassword')} serverError={error} isLoading={isLoading} />;
  }
  if (currentView === 'forgotpassword') {
    return <ForgotPasswordPage onBackToSignIn={() => setCurrentView('signin')} onBackToLanding={() => setCurrentView('landing')} />;
  }
  if (currentView === 'profile') {
    return <ProfilePage onUpdateProfile={handleUpdateProfile} onBack={() => setCurrentView('app')} />;
  }
  if (currentView === 'settings') {
    return <SettingsPage onLogout={handleLogout} onBack={() => setCurrentView('app')} />;
  }

  // Main app view with AppShell
  return <AppShell userName={user?.name} onProfileClick={() => setCurrentView('profile')} onSettingsClick={() => setCurrentView('settings')} />;
};
export const AuthenticatedApp = () => {
  return <AuthProvider>
      <AuthenticatedAppContent />
    </AuthProvider>;
};