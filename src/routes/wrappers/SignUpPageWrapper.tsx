import { useNavigate } from 'react-router-dom';
import { SignUpPage } from '../../components/auth/SignUpPage';
import { useAuth } from '../../components/common/AuthContext';

export function SignUpPageWrapper() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    await signUp(data.email, data.password, data.name);
    navigate('/app/dashboard');
  };

  return (
    <SignUpPage
      onSignUp={handleSignUp}
      onBackToLanding={() => navigate('/')}
      onGoToSignIn={() => navigate('/auth/signin')}
    />
  );
}
