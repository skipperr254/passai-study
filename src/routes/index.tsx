import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { LandingPageWrapper } from '@/routes/wrappers/LandingPageWrapper';
import { SignInPageWrapper } from '@/routes/wrappers/SignInPageWrapper';
import { SignUpPageWrapper } from '@/routes/wrappers/SignUpPageWrapper';
import { ForgotPasswordPageWrapper } from '@/routes/wrappers/ForgotPasswordPageWrapper';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { SubjectsPage } from '@/components/subject/SubjectsPage';
import { QuizzesPage } from '@/components/quiz/QuizzesPage';
import { QuizDetailPageWrapper } from '@/routes/wrappers/QuizDetailPageWrapper';
import { MaterialsPage } from '@/components/generated/MaterialsPage';
import { StudyPlanPage } from '@/components/common/StudyPlanPage';
import { ProfilePageWrapper } from '@/routes/wrappers/ProfilePageWrapper';
import { SettingsPageWrapper } from '@/routes/wrappers/SettingsPageWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPageWrapper />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'signin',
            element: <SignInPageWrapper />,
          },
          {
            path: 'signup',
            element: <SignUpPageWrapper />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPageWrapper />,
          },
        ],
      },
      {
        path: 'app',
        element: <AuthenticatedApp />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'subjects',
            element: <SubjectsPage />,
          },
          {
            path: 'quizzes',
            element: <QuizzesPage />,
          },
          {
            path: 'quizzes/:quizId',
            element: <QuizDetailPageWrapper />,
          },
          {
            path: 'materials',
            element: <MaterialsPage />,
          },
          {
            path: 'study-plan',
            element: <StudyPlanPage />,
          },
          {
            path: 'profile',
            element: <ProfilePageWrapper />,
          },
          {
            path: 'settings',
            element: <SettingsPageWrapper />,
          },
        ],
      },
    ],
  },
]);
