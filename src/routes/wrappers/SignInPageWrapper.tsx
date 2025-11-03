import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SignInPage } from '../../components/auth/SignInPage';
import { useAuth } from '../../components/common/AuthContext';

export function SignInPageWrapper() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await signIn(data.email, data.password);
      toast.success('Signed in successfully!');
      navigate('/app/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInPage
      onSignIn={handleSignIn}
      onBackToLanding={() => navigate('/')}
      onGoToSignUp={() => navigate('/auth/signup')}
      onForgotPassword={() => navigate('/auth/forgot-password')}
      serverError={serverError}
      isLoading={isLoading}
    />
  );
}
