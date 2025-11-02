import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../../components/generated/LandingPage';

export function LandingPageWrapper() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onGetStarted={() => navigate('/auth/signup')}
      onSignIn={() => navigate('/auth/signin')}
    />
  );
}
