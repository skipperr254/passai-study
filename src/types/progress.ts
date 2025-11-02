export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  startedAt: string;
  endedAt?: string;
  duration: number; // minutes
  activitiesCompleted: number;
  focusScore?: number; // 0-100
  mood?: 'happy' | 'neutral' | 'frustrated' | 'tired';
  notes?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  subjectId: string;
  goalDate: string;
  weeklyGoal: number; // hours
  dailyTasks: DailyTask[];
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  date: string;
  title: string;
  description?: string;
  duration: number; // minutes
  completed: boolean;
  completedAt?: string;
  type: 'quiz' | 'review' | 'practice' | 'reading';
}

export interface ProgressSnapshot {
  date: string;
  totalStudyTime: number; // minutes
  quizzesCompleted: number;
  averageScore: number;
  subjectsStudied: number;
  streak: number;
  mood: string;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  totalStudyTime: number;
  dailyProgress: ProgressSnapshot[];
  topSubjects: { subject: string; time: number }[];
  achievements: string[];
}

export interface GardenProgress {
  userId: string;
  level: number;
  experience: number;
  nextLevelXp: number;
  plantsUnlocked: number;
  totalPlants: number;
  gardenItems: GardenItem[];
}

export interface GardenItem {
  id: string;
  type: 'plant' | 'decoration';
  name: string;
  icon: string;
  level: number;
  unlocked: boolean;
  progress: number; // 0-100
  xpRequired: number;
}
