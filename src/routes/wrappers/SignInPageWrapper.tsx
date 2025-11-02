import { useNavigate } from 'react-router-dom';
import { SignInPage } from '../../components/generated/SignInPage';
import { useAuth } from '../../components/generated/AuthContext';

export function SignInPageWrapper() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSignIn = async (data: { email: string; password: string }) => {
    await signIn(data.email, data.password);
    navigate('/app/dashboard');
  };

  return (
    <SignInPage
      onSignIn={handleSignIn}
      onBackToLanding={() => navigate('/')}
      onGoToSignUp={() => navigate('/auth/signup')}
      onForgotPassword={() => navigate('/auth/forgot-password')}
      serverError={null}
      isLoading={false}
    />
  );
}
