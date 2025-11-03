import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  generateQuestions,
  getQuestions,
  type CreateQuizDto,
  type UpdateQuizDto,
} from '@/services/quiz.service';
import type { Quiz } from '@/types/quiz';
import type { Question } from '@/types/question';

/**
 * Hook for managing quizzes
 * @param subjectId - Optional subject ID to filter quizzes
 */
export function useQuizzes(subjectId?: string) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch quizzes (filtered by subject or all)
   */
  const fetchQuizzes = useCallback(async () => {
    if (!user?.id) {
      setQuizzes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getQuizzes(user.id, subjectId);
      setQuizzes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quizzes';
      setError(message);
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, subjectId]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  /**
   * Create a new quiz
   */
  const addQuiz = async (dto: CreateQuizDto): Promise<Quiz | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newQuiz = await createQuiz(user.id, dto);
      setQuizzes(prev => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create quiz';
      setError(message);
      console.error('Error creating quiz:', err);
      return null;
    }
  };

  /**
   * Update quiz metadata
   */
  const editQuiz = async (quizId: string, dto: UpdateQuizDto): Promise<Quiz | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const updatedQuiz = await updateQuiz(quizId, user.id, dto);
      setQuizzes(prev => prev.map(quiz => (quiz.id === quizId ? updatedQuiz : quiz)));
      return updatedQuiz;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update quiz';
      setError(message);
      console.error('Error updating quiz:', err);
      return null;
    }
  };

  /**
   * Delete a quiz
   */
  const removeQuiz = async (quizId: string): Promise<boolean> => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await deleteQuiz(quizId, user.id);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete quiz';
      setError(message);
      console.error('Error deleting quiz:', err);
      return false;
    }
  };

  /**
   * Get a single quiz with its questions
   */
  const getQuiz = async (quizId: string): Promise<{ quiz: Quiz; questions: Question[] } | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      return await getQuizById(quizId, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quiz';
      setError(message);
      console.error('Error fetching quiz:', err);
      return null;
    }
  };

  /**
   * Generate questions for a quiz
   */
  const createQuestions = async (
    quizId: string,
    materialIds: string[],
    settings: import('@/types/quiz').QuizSettings
  ): Promise<Question[] | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const questions = await generateQuestions(quizId, user.id, materialIds, settings);

      // Update the quiz in local state to reflect new question count
      setQuizzes(prev =>
        prev.map(quiz => (quiz.id === quizId ? { ...quiz, questionCount: questions.length } : quiz))
      );

      return questions;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(message);
      console.error('Error generating questions:', err);
      return null;
    }
  };

  /**
   * Get questions for a quiz
   */
  const fetchQuestions = async (quizId: string): Promise<Question[] | null> => {
    try {
      setError(null);
      return await getQuestions(quizId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch questions';
      setError(message);
      console.error('Error fetching questions:', err);
      return null;
    }
  };

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    addQuiz,
    editQuiz,
    removeQuiz,
    getQuiz,
    createQuestions,
    fetchQuestions,
  };
}
