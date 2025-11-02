export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
  description?: string;
  testDate?: string;
  teacherEmphasis?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  lastStudied?: string;
  masteryLevel: number; // 0-100
  weakTopics: string[];
  strongTopics: string[];
}

export interface SubjectStatistics {
  totalMaterials: number;
  totalQuizzes: number;
  hoursStudied: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'quiz' | 'material' | 'study';
  title: string;
  date: string;
  score?: number;
}
