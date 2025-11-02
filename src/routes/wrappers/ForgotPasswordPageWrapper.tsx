import { useNavigate } from 'react-router-dom';
import { ForgotPasswordPage } from '../../components/generated/ForgotPasswordPage';

export function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordPage
      onBackToSignIn={() => navigate('/auth/signin')}
      onBackToLanding={() => navigate('/')}
    />
  );
}
