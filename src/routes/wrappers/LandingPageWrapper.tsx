import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../../components/auth/LandingPage';

export function LandingPageWrapper() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onGetStarted={() => navigate('/auth/signup')}
      onSignIn={() => navigate('/auth/signin')}
    />
  );
}
