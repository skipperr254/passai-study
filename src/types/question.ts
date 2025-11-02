export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // Can be multiple for multi-select
  explanation?: string;
  points: number;
  order: number;
  tags?: string[];
  materialReferences?: string[]; // IDs of related materials
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  attemptId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // seconds
  answeredAt: string;
}

export interface QuestionBank {
  id: string;
  subjectId: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionStatistics {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTimeSpent: number;
  successRate: number; // 0-100
}
