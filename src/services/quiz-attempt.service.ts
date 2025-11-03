import { supabase } from '@/lib/supabase';
import type { QuizAttempt, QuizResults } from '@/types/quiz';
import type { QuestionResponse } from '@/types/question';

// Database row types
interface QuizAttemptDbRow {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  status: 'in-progress' | 'completed' | 'abandoned';
  score: number;
  percentage: number;
  time_spent: number;
  created_at: string;
}

interface QuestionResponseDbRow {
  id: string;
  attempt_id: string;
  question_id: string;
  user_answer: string | string[];
  is_correct: boolean;
  time_spent: number;
  points_earned: number;
  answered_at: string;
}

// Map database row to QuizAttempt type
const mapAttemptFromDb = (
  row: QuizAttemptDbRow,
  responses: QuestionResponse[] = []
): QuizAttempt => ({
  id: row.id,
  quizId: row.quiz_id,
  userId: row.user_id,
  startedAt: row.started_at,
  completedAt: row.completed_at || undefined,
  status: row.status,
  score: row.score,
  percentage: row.percentage,
  timeSpent: row.time_spent,
  responses,
});

// Map database row to QuestionResponse type
const mapResponseFromDb = (row: QuestionResponseDbRow): QuestionResponse => ({
  id: row.id,
  attemptId: row.attempt_id,
  questionId: row.question_id,
  answer: row.user_answer,
  isCorrect: row.is_correct,
  timeSpent: row.time_spent,
  pointsEarned: row.points_earned,
  answeredAt: row.answered_at,
});

/**
 * Start a new quiz attempt
 */
export const startAttempt = async (quizId: string, userId: string): Promise<QuizAttempt | null> => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: userId,
        started_at: new Date().toISOString(),
        status: 'in-progress',
        score: 0,
        percentage: 0,
        time_spent: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting quiz attempt:', error);
      return null;
    }

    return mapAttemptFromDb(data);
  } catch (error) {
    console.error('Error starting quiz attempt:', error);
    return null;
  }
};

/**
 * Get a specific quiz attempt with responses
 */
export const getAttempt = async (
  attemptId: string,
  userId: string
): Promise<QuizAttempt | null> => {
  try {
    // Fetch attempt
    const { data: attemptData, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', userId)
      .single();

    if (attemptError || !attemptData) {
      console.error('Error fetching attempt:', attemptError);
      return null;
    }

    // Fetch responses
    const { data: responsesData, error: responsesError } = await supabase
      .from('question_responses')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('answered_at', { ascending: true });

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return mapAttemptFromDb(attemptData);
    }

    const responses = responsesData?.map(mapResponseFromDb) || [];
    return mapAttemptFromDb(attemptData, responses);
  } catch (error) {
    console.error('Error getting attempt:', error);
    return null;
  }
};

/**
 * Get all attempts for a quiz
 */
export const getQuizAttempts = async (quizId: string, userId: string): Promise<QuizAttempt[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }

    return data?.map(row => mapAttemptFromDb(row)) || [];
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return [];
  }
};

/**
 * Save a question response
 */
export const saveResponse = async (
  attemptId: string,
  questionId: string,
  userAnswer: string | string[],
  isCorrect: boolean,
  timeSpent: number,
  pointsEarned: number
): Promise<QuestionResponse | null> => {
  try {
    // Check if response already exists
    const { data: existing } = await supabase
      .from('question_responses')
      .select('id')
      .eq('attempt_id', attemptId)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      // Update existing response
      const { data, error } = await supabase
        .from('question_responses')
        .update({
          user_answer: userAnswer,
          is_correct: isCorrect,
          time_spent: timeSpent,
          points_earned: pointsEarned,
          answered_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating response:', error);
        return null;
      }

      return mapResponseFromDb(data);
    } else {
      // Insert new response
      const { data, error } = await supabase
        .from('question_responses')
        .insert({
          attempt_id: attemptId,
          question_id: questionId,
          user_answer: userAnswer,
          is_correct: isCorrect,
          time_spent: timeSpent,
          points_earned: pointsEarned,
          answered_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving response:', error);
        return null;
      }

      return mapResponseFromDb(data);
    }
  } catch (error) {
    console.error('Error saving response:', error);
    return null;
  }
};

/**
 * Submit quiz attempt and calculate final score
 */
export const submitAttempt = async (
  attemptId: string,
  userId: string,
  timeSpent: number
): Promise<QuizAttempt | null> => {
  try {
    // Fetch all responses for this attempt
    const { data: responses, error: responsesError } = await supabase
      .from('question_responses')
      .select('*')
      .eq('attempt_id', attemptId);

    if (responsesError) {
      console.error('Error fetching responses for submission:', responsesError);
      return null;
    }

    // Calculate score
    const totalQuestions = responses?.length || 0;
    const correctAnswers = responses?.filter(r => r.is_correct).length || 0;
    const totalPoints = responses?.reduce((sum, r) => sum + r.points_earned, 0) || 0;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Update attempt
    const { data, error } = await supabase
      .from('quiz_attempts')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        score: totalPoints,
        percentage,
        time_spent: timeSpent,
      })
      .eq('id', attemptId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error submitting attempt:', error);
      return null;
    }

    const mappedResponses = responses?.map(mapResponseFromDb) || [];
    return mapAttemptFromDb(data, mappedResponses);
  } catch (error) {
    console.error('Error submitting attempt:', error);
    return null;
  }
};

/**
 * Update attempt progress (for autosave)
 */
export const updateAttemptProgress = async (
  attemptId: string,
  userId: string,
  timeSpent: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quiz_attempts')
      .update({
        time_spent: timeSpent,
      })
      .eq('id', attemptId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating attempt progress:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating attempt progress:', error);
    return false;
  }
};

/**
 * Abandon an in-progress attempt
 */
export const abandonAttempt = async (attemptId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'abandoned',
      })
      .eq('id', attemptId)
      .eq('user_id', userId)
      .eq('status', 'in-progress');

    if (error) {
      console.error('Error abandoning attempt:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error abandoning attempt:', error);
    return false;
  }
};

/**
 * Get quiz results with analytics
 */
export const getQuizResults = async (
  attemptId: string,
  userId: string
): Promise<QuizResults | null> => {
  try {
    const attempt = await getAttempt(attemptId, userId);
    if (!attempt) return null;

    // Fetch quiz data
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', attempt.quizId)
      .single();

    if (quizError || !quizData) {
      console.error('Error fetching quiz for results:', quizError);
      return null;
    }

    // Fetch questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', attempt.quizId)
      .order('order_index', { ascending: true });

    if (questionsError) {
      console.error('Error fetching questions for results:', questionsError);
      return null;
    }

    // Calculate analytics
    const totalQuestions = attempt.responses.length;
    const correctAnswers = attempt.responses.filter(r => r.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const skippedAnswers = 0; // TODO: Track skipped answers
    const averageTimePerQuestion = totalQuestions > 0 ? attempt.timeSpent / totalQuestions : 0;

    // TODO: Implement strength/weakness area analysis from responses
    const strengthAreas: string[] = [];
    const weaknessAreas: string[] = [];
    const recommendedTopics: string[] = [];

    const analytics = {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      averageTimePerQuestion,
      strengthAreas,
      weaknessAreas,
      recommendedTopics,
    };

    return {
      attempt,
      quiz: {
        id: quizData.id,
        userId: quizData.user_id,
        subjectId: quizData.subject_id,
        title: quizData.title,
        description: quizData.description,
        mode: quizData.mode,
        status: quizData.status,
        difficulty: quizData.difficulty,
        timeLimit: quizData.time_limit,
        passingScore: quizData.passing_score,
        materialIds: [], // TODO: Fetch from quiz_materials table
        questionCount: quizData.question_count,
        totalPoints: quizData.total_points || 0,
        createdAt: quizData.created_at,
        updatedAt: quizData.updated_at,
        scheduledFor: quizData.scheduled_for,
      },
      questions:
        questionsData?.map(q => ({
          id: q.id,
          quizId: q.quiz_id,
          type: q.type,
          difficulty: q.difficulty,
          question: q.question_text,
          options: q.options ? JSON.parse(q.options) : undefined,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          points: 1, // TODO: Add points field to questions table
          order: q.order_index,
          tags: q.topic ? [q.topic] : undefined,
          materialReferences: q.source_material_id ? [q.source_material_id] : undefined,
        })) || [],
      responses: attempt.responses,
      analytics,
    };
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return null;
  }
};
