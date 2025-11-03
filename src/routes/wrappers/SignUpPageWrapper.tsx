import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SignUpPage } from '../../components/auth/SignUpPage';
import { useAuth } from '../../components/common/AuthContext';

export function SignUpPageWrapper() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await signUp(data.name, data.email, data.password);
      toast.success('Account created! Please check your email to confirm your account.');
      // Don't navigate yet - wait for email confirmation
      navigate('/auth/signin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpPage
      onSignUp={handleSignUp}
      onBackToLanding={() => navigate('/')}
      onGoToSignIn={() => navigate('/auth/signin')}
      serverError={serverError}
      isLoading={isLoading}
    />
  );
}
