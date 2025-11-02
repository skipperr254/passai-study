import { useNavigate } from 'react-router-dom';
import { ProfilePage, UserProfile } from '../../components/common/ProfilePage';

export function ProfilePageWrapper() {
  const navigate = useNavigate();

  const handleUpdateProfile = (data: Partial<UserProfile>) => {
    // Mock update profile
    console.log('Profile updated:', data);
  };

  return <ProfilePage onUpdateProfile={handleUpdateProfile} onBack={() => navigate(-1)} />;
}
