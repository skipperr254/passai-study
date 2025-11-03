import { supabase } from '@/lib/supabase';
import type { Subject } from '@/types/subject';
import type { Quiz } from '@/types/quiz';

export interface DashboardStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeStudied: number; // in seconds
  currentStreak: number; // days
  longestStreak: number; // days
  totalSubjects: number;
  totalMaterials: number;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  quizzesTaken: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  lastAttempt: string | null;
  totalTimeSpent: number;
  passingChance: number; // calculated based on trend
  upcomingQuiz: string | null;
  recentTrend: 'improving' | 'declining' | 'stable';
}

export interface RecentActivity {
  id: string;
  type: 'quiz_completed' | 'material_uploaded' | 'subject_created';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface ProgressData {
  date: string;
  score: number;
  quizTitle: string;
}

/**
 * Get overall dashboard statistics
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats | null> {
  try {
    // Get quiz counts
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, status')
      .eq('user_id', userId);

    if (quizzesError) throw quizzesError;

    // Get completed attempts with scores
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('percentage, time_spent, completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (attemptsError) throw attemptsError;

    // Get subjects count
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id')
      .eq('user_id', userId);

    if (subjectsError) throw subjectsError;

    // Get materials count
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id')
      .eq('user_id', userId);

    if (materialsError) throw materialsError;

    // Calculate average score
    const averageScore =
      attempts && attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
        : 0;

    // Calculate total time studied (in seconds)
    const totalTimeStudied = attempts
      ? attempts.reduce((sum, a) => sum + (a.time_spent || 0), 0)
      : 0;

    // Calculate streaks (simplified - based on consecutive days with completed quizzes)
    const streak = calculateStreak(attempts || []);

    return {
      totalQuizzes: quizzes?.length || 0,
      completedQuizzes: attempts?.length || 0,
      averageScore,
      totalTimeStudied,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      totalSubjects: subjects?.length || 0,
      totalMaterials: materials?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

/**
 * Calculate study streaks
 */
function calculateStreak(attempts: Array<{ completed_at: string | null }>): {
  current: number;
  longest: number;
} {
  if (!attempts || attempts.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Sort by date descending
  const dates = attempts
    .filter(a => a.completed_at)
    .map(a => new Date(a.completed_at!).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (dates.length === 0) {
    return { current: 0, longest: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let prevDate = new Date(dates[0]);

  // Check if today or yesterday
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1;
  }

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / 86400000);

    if (dayDiff === 1) {
      tempStreak++;
      if (i === 1 && (dates[0] === today || dates[0] === yesterday)) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    prevDate = currentDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Get performance data for all subjects
 */
export async function getSubjectPerformance(
  userId: string,
  subjects: Subject[]
): Promise<SubjectPerformance[]> {
  try {
    const performanceData: SubjectPerformance[] = [];

    for (const subject of subjects) {
      // Get all quizzes for this subject
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id, title, scheduled_for')
        .eq('user_id', userId)
        .eq('subject_id', subject.id);

      if (quizzesError) throw quizzesError;

      const quizIds = quizzes?.map(q => q.id) || [];

      if (quizIds.length === 0) {
        performanceData.push({
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          quizzesTaken: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          lastAttempt: null,
          totalTimeSpent: 0,
          passingChance: 0,
          upcomingQuiz: null,
          recentTrend: 'stable',
        });
        continue;
      }

      // Get all completed attempts for these quizzes
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('percentage, time_spent, completed_at')
        .in('quiz_id', quizIds)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      const scores = attempts?.map(a => a.percentage) || [];
      const averageScore =
        scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0;

      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
      const lastAttempt = attempts && attempts.length > 0 ? attempts[0].completed_at : null;
      const totalTimeSpent = attempts?.reduce((sum, a) => sum + (a.time_spent || 0), 0) || 0;

      // Calculate passing chance based on recent trend
      const passingChance = calculatePassingChance(scores);
      const recentTrend = calculateTrend(scores);

      // Get upcoming scheduled quiz
      const upcomingQuiz = quizzes
        ?.filter(q => q.scheduled_for && new Date(q.scheduled_for) > new Date())
        .sort(
          (a, b) => new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime()
        )[0];

      performanceData.push({
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        quizzesTaken: attempts?.length || 0,
        averageScore,
        highestScore,
        lowestScore,
        lastAttempt,
        totalTimeSpent,
        passingChance,
        upcomingQuiz: upcomingQuiz?.scheduled_for || null,
        recentTrend,
      });
    }

    return performanceData;
  } catch (error) {
    console.error('Error fetching subject performance:', error);
    return [];
  }
}

/**
 * Calculate passing chance based on score trend
 */
function calculatePassingChance(scores: number[]): number {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  // Weight recent scores more heavily
  const recentScores = scores.slice(0, Math.min(5, scores.length));
  const weights = recentScores.map((_, i) => 1 / (i + 1)); // 1, 0.5, 0.33, 0.25, 0.2
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const weightedAverage =
    recentScores.reduce((sum, score, i) => {
      return sum + score * weights[i];
    }, 0) / totalWeight;

  // Add trend bonus/penalty
  const trend = calculateTrend(scores);
  let bonus = 0;
  if (trend === 'improving') bonus = 5;
  if (trend === 'declining') bonus = -5;

  return Math.min(100, Math.max(0, Math.round(weightedAverage + bonus)));
}

/**
 * Calculate score trend
 */
function calculateTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 3) return 'stable';

  const recent = scores.slice(0, 3);
  const older = scores.slice(3, 6);

  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((sum, s) => sum + s, 0) / recent.length;
  const olderAvg = older.reduce((sum, s) => sum + s, 0) / older.length;

  const diff = recentAvg - olderAvg;

  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

/**
 * Get recent activity feed
 */
export async function getRecentActivity(userId: string): Promise<RecentActivity[]> {
  try {
    const activities: RecentActivity[] = [];

    // Get recent quiz completions
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select(
        `
        id,
        percentage,
        completed_at,
        quiz_id
      `
      )
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5);

    if (!attemptsError && attempts) {
      // Fetch quiz titles for these attempts
      const quizIds = attempts.map(a => a.quiz_id);
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id, title')
        .in('id', quizIds);

      const quizMap = new Map(quizzes?.map(q => [q.id, q.title]) || []);

      attempts.forEach(attempt => {
        if (attempt.completed_at) {
          activities.push({
            id: attempt.id,
            type: 'quiz_completed',
            title: 'Quiz Completed',
            description: `Scored ${attempt.percentage}% on ${quizMap.get(attempt.quiz_id) || 'quiz'}`,
            timestamp: attempt.completed_at,
            icon: 'CheckCircle2',
            color: attempt.percentage >= 70 ? 'text-green-600' : 'text-amber-600',
          });
        }
      });
    }

    // Get recent material uploads
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!materialsError && materials) {
      materials.forEach(material => {
        activities.push({
          id: material.id,
          type: 'material_uploaded',
          title: 'Material Uploaded',
          description: material.title,
          timestamp: material.created_at,
          icon: 'FileText',
          color: 'text-blue-600',
        });
      });
    }

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, 10);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

/**
 * Get progress data for charts (last N quizzes)
 */
export async function getProgressData(
  userId: string,
  subjectId?: string,
  limit: number = 10
): Promise<ProgressData[]> {
  try {
    let query = supabase
      .from('quiz_attempts')
      .select(
        `
        percentage,
        completed_at,
        quiz_id
      `
      )
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: true });

    if (subjectId) {
      // Filter by subject (requires join)
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id')
        .eq('subject_id', subjectId);

      const quizIds = quizzes?.map(q => q.id) || [];
      if (quizIds.length > 0) {
        query = query.in('quiz_id', quizIds);
      }
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Fetch quiz titles
    const quizIds = data.map(a => a.quiz_id);
    const { data: quizzes } = await supabase.from('quizzes').select('id, title').in('id', quizIds);

    const quizMap = new Map(quizzes?.map(q => [q.id, q.title]) || []);

    return data.map((attempt, index) => ({
      date: new Date(attempt.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: attempt.percentage,
      quizTitle: quizMap.get(attempt.quiz_id) || `Quiz ${index + 1}`,
    }));
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return [];
  }
}
