// =====================================================
// Study Plan & Learning Types
// =====================================================

/**
 * Topic - Individual topic within a subject
 */
export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: number; // minutes
  createdAt: string;
  updatedAt: string;
}

/**
 * Topic Mastery - User's mastery level for a topic
 */
export interface TopicMastery {
  id: string;
  userId: string;
  topicId: string;
  subjectId: string;

  // Mastery metrics
  masteryLevel: number; // 0-100

  // Learning statistics
  totalQuizzesTaken: number;
  quizzesPassed: number;
  averageQuizScore: number;
  lastQuizScore?: number;

  // Performance trend
  trend: 'up' | 'down' | 'stable' | 'unknown';

  // Timestamps
  lastStudiedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Populated fields (joins)
  topic?: Topic;
}

/**
 * Study Task - Individual task in study plan
 */
export interface StudyTask {
  id: string;
  userId: string;
  subjectId: string;
  topicId?: string;

  // Task details
  title: string;
  description: string;
  type: StudyTaskType;
  priority: TaskPriority;

  // Time tracking
  estimatedTime: number; // minutes
  timeSpent: number; // actual minutes

  // Completion
  status: TaskStatus;
  completedAt?: string;

  // Verification
  requiresVerification: boolean;
  verificationStatus?: VerificationStatus;
  verificationQuizId?: string;

  // Scheduling
  dueDate?: string;

  createdAt: string;
  updatedAt: string;

  // Populated fields (joins)
  topic?: Topic;
}

/**
 * Study Task Types
 */
export type StudyTaskType =
  | 'review' // Review materials
  | 'practice' // Practice problems
  | 'quiz' // Take a quiz
  | 'flashcards' // Flashcard review
  | 'material'; // Read/watch materials

/**
 * Task Priority Levels
 */
export type TaskPriority = 'high' | 'medium' | 'low';

/**
 * Task Status
 */
export type TaskStatus =
  | 'pending' // Not started
  | 'in-progress' // Currently working on
  | 'completed' // Finished
  | 'skipped'; // Skipped

/**
 * Verification Status
 */
export type VerificationStatus =
  | 'pending' // Waiting to be verified
  | 'passed' // Verification passed
  | 'failed' // Verification failed
  | 'skipped'; // Verification skipped

/**
 * Mastery Report - Overview of subject mastery
 */
export interface MasteryReport {
  subjectId: string;
  overallMastery: number;
  topicCount: number;
  masteredTopics: number; // mastery >= 80
  weakTopics: TopicMastery[];
  strongTopics: TopicMastery[];
  recentProgress: {
    lastWeek: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

/**
 * Study Statistics
 */
export interface StudyStatistics {
  totalStudyTime: number; // minutes
  tasksCompleted: number;
  tasksTotal: number;
  averageTaskTime: number;
  verificationPassRate: number;
  currentStreak: number; // days
}

/**
 * Database row types (snake_case from database)
 */
export interface TopicDbRow {
  id: string;
  subject_id: string;
  name: string;
  description: string | null;
  difficulty: string;
  estimated_study_time: number;
  created_at: string;
  updated_at: string;
}

export interface TopicMasteryDbRow {
  id: string;
  user_id: string;
  topic_id: string;
  subject_id: string;
  mastery_level: number;
  total_quizzes_taken: number;
  quizzes_passed: number;
  average_quiz_score: number;
  last_quiz_score: number | null;
  trend: string;
  last_studied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyTaskDbRow {
  id: string;
  user_id: string;
  subject_id: string;
  topic_id: string | null;
  title: string;
  description: string;
  type: string;
  priority: string;
  estimated_time: number;
  time_spent: number;
  status: string;
  completed_at: string | null;
  requires_verification: boolean;
  verification_status: string | null;
  verification_quiz_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
