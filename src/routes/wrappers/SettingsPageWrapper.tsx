import { useNavigate } from 'react-router-dom';
import { SettingsPage } from '../../components/common/SettingsPage';
import { useAuth } from '../../components/common/AuthContext';

export function SettingsPageWrapper() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return <SettingsPage onLogout={handleLogout} onBack={() => navigate(-1)} />;
}
