export const APP_CONFIG = {
  name: 'PassAI',
  version: '1.0.0',
  description: 'AI-Powered Study Platform',
  supportEmail: 'support@passai.com',
} as const;

export const ROUTES = {
  HOME: '/',
  // Auth routes
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  // App routes
  DASHBOARD: '/app/dashboard',
  SUBJECTS: '/app/subjects',
  SUBJECT_DETAIL: (id: string) => `/app/subjects/${id}`,
  QUIZZES: '/app/quizzes',
  QUIZ_DETAIL: (id: string) => `/app/quizzes/${id}`,
  QUIZ_SESSION: (id: string) => `/app/quiz/${id}/session`,
  QUIZ_RESULTS: (id: string) => `/app/quiz/${id}/results`,
  MATERIALS: '/app/materials',
  STUDY_PLAN: '/app/study-plan',
  PROFILE: '/app/profile',
  SETTINGS: '/app/settings',
} as const;

export const QUIZ_CONFIG = {
  defaultQuestionCount: 10,
  maxQuestionCount: 50,
  minQuestionCount: 5,
  defaultTimeLimit: 30, // minutes
  passingScore: 70, // percentage
} as const;

export const SUBJECT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
] as const;

export const FILE_UPLOAD = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFileTypes: {
    pdf: 'application/pdf',
    image: 'image/*',
    video: 'video/*',
    document: '.doc,.docx,.txt',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'passai_auth_token',
  USER_PREFERENCES: 'passai_user_preferences',
  THEME: 'passai_theme',
} as const;

export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;

export const NOTIFICATION_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
} as const;
