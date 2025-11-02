import { Question, QuestionResponse, DifficultyLevel } from './question';

export type QuizStatus = 'draft' | 'ready' | 'in-progress' | 'completed' | 'archived';
export type QuizMode = 'practice' | 'test' | 'timed' | 'adaptive';

export interface Quiz {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  description?: string;
  mode: QuizMode;
  status: QuizStatus;
  difficulty: DifficultyLevel;
  timeLimit?: number; // minutes
  passingScore?: number; // percentage
  materialIds: string[]; // Source materials
  questionCount: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  score: number;
  percentage: number;
  timeSpent: number; // seconds
  responses: QuestionResponse[];
}

export interface QuizSession {
  quiz: Quiz;
  attempt: QuizAttempt;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Map<string, string | string[]>;
  timeRemaining?: number; // seconds
}

export interface QuizResults {
  attempt: QuizAttempt;
  quiz: Quiz;
  questions: Question[];
  responses: QuestionResponse[];
  analytics: QuizAnalytics;
}

export interface QuizAnalytics {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  averageTimePerQuestion: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendedTopics: string[];
}

export interface QuizSettings {
  questionCount: number;
  difficulty: DifficultyLevel;
  mode: QuizMode;
  timeLimit?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanations: boolean;
  allowReview: boolean;
}

export interface QuizSummary {
  id: string;
  title: string;
  subjectName: string;
  questionCount: number;
  lastAttempt?: {
    date: string;
    score: number;
  };
  averageScore: number;
  totalAttempts: number;
}
