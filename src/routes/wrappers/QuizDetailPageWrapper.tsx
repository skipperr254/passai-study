import { useParams, useNavigate } from 'react-router-dom';
import { QuizDetailPage } from '@/components/quiz/QuizDetailPage';

export const QuizDetailPageWrapper = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  if (!quizId) {
    navigate('/app/quizzes');
    return null;
  }

  return <QuizDetailPage quizId={quizId} onBack={() => navigate('/app/quizzes')} />;
};
