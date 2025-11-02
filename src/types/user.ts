export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  studyGoal?: string;
  joinDate: string;
  stats: UserStats;
  achievements: Achievement[];
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  studyStreak: number;
  subjectsStudied: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  studyReminders: boolean;
  soundEffects: boolean;
  autoSave: boolean;
}
