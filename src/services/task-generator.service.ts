import { supabase } from '../lib/supabase';
import type { StudyTask, TopicMastery } from '../types/learning';
import { getTopicMasteryBySubject, getWeakTopics } from './topic.service';
import { createStudyTasksBatch } from './study-task.service';

// =====================================================
// TASK GENERATION
// =====================================================

/**
 * Generate study tasks for a subject based on topic mastery
 * MVP: Simple rule-based generation
 */
export const generateStudyTasksForSubject = async (
  userId: string,
  subjectId: string,
  daysToGenerate: number = 7
): Promise<StudyTask[]> => {
  try {
    // Get topic mastery data
    const topicMastery = await getTopicMasteryBySubject(userId, subjectId);
    const weakTopics = await getWeakTopics(userId, subjectId, 70);

    const tasks: Omit<
      StudyTask,
      'id' | 'createdAt' | 'updatedAt' | 'timeSpent' | 'status' | 'completedAt'
    >[] = [];
    const today = new Date();

    // If no mastery data yet, create initial assessment tasks
    if (topicMastery.length === 0) {
      // Get all topics for the subject
      const { data: topics } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId);

      if (topics && topics.length > 0) {
        // Create initial study tasks for the first 3 topics
        topics.slice(0, 3).forEach((topic, index) => {
          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + index);

          tasks.push({
            userId,
            subjectId,
            topicId: topic.id,
            title: `Study: ${topic.name}`,
            description: `Review and learn the basics of ${topic.name}. ${topic.description || ''}`,
            type: 'material',
            priority: 'high',
            estimatedTime: topic.estimated_study_time || 30,
            requiresVerification: true,
            dueDate: dueDate.toISOString().split('T')[0],
          });

          // Add quiz task after study
          const quizDueDate = new Date(dueDate);
          quizDueDate.setDate(quizDueDate.getDate() + 1);

          tasks.push({
            userId,
            subjectId,
            topicId: topic.id,
            title: `Quiz: ${topic.name}`,
            description: `Test your knowledge on ${topic.name}`,
            type: 'quiz',
            priority: 'high',
            estimatedTime: 15,
            requiresVerification: false,
            dueDate: quizDueDate.toISOString().split('T')[0],
          });
        });
      }
    } else {
      // Generate tasks based on mastery levels

      // 1. Focus on weak topics (mastery < 70%)
      if (weakTopics.length > 0) {
        weakTopics.slice(0, 3).forEach((mastery, index) => {
          if (!mastery.topic) return;

          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + index);

          // Review task for weak topics
          tasks.push({
            userId,
            subjectId,
            topicId: mastery.topicId,
            title: `Review: ${mastery.topic.name}`,
            description: `Focus on improving ${mastery.topic.name}. Current mastery: ${Math.round(mastery.masteryLevel)}%`,
            type: 'review',
            priority: 'high',
            estimatedTime: 25,
            requiresVerification: true,
            dueDate: dueDate.toISOString().split('T')[0],
          });

          // Practice task
          const practiceDueDate = new Date(dueDate);
          practiceDueDate.setDate(practiceDueDate.getDate() + 1);

          tasks.push({
            userId,
            subjectId,
            topicId: mastery.topicId,
            title: `Practice: ${mastery.topic.name}`,
            description: `Work on practice problems for ${mastery.topic.name}`,
            type: 'practice',
            priority: 'high',
            estimatedTime: 20,
            requiresVerification: true,
            dueDate: practiceDueDate.toISOString().split('T')[0],
          });
        });
      }

      // 2. Maintain strong topics (mastery >= 80%) with spaced repetition
      const strongTopics = topicMastery.filter(m => m.masteryLevel >= 80);
      if (strongTopics.length > 0) {
        strongTopics.slice(0, 2).forEach((mastery, index) => {
          if (!mastery.topic) return;

          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + 3 + index * 2); // Space out reviews

          tasks.push({
            userId,
            subjectId,
            topicId: mastery.topicId,
            title: `Quick Review: ${mastery.topic.name}`,
            description: `Maintain your mastery of ${mastery.topic.name}. Current: ${Math.round(mastery.masteryLevel)}%`,
            type: 'flashcards',
            priority: 'low',
            estimatedTime: 10,
            requiresVerification: false,
            dueDate: dueDate.toISOString().split('T')[0],
          });
        });
      }

      // 3. Medium mastery topics (70-79%) - practice
      const mediumTopics = topicMastery.filter(m => m.masteryLevel >= 70 && m.masteryLevel < 80);
      if (mediumTopics.length > 0) {
        mediumTopics.slice(0, 2).forEach((mastery, index) => {
          if (!mastery.topic) return;

          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + 2 + index);

          tasks.push({
            userId,
            subjectId,
            topicId: mastery.topicId,
            title: `Practice Quiz: ${mastery.topic.name}`,
            description: `Push your ${mastery.topic.name} knowledge to mastery level`,
            type: 'quiz',
            priority: 'medium',
            estimatedTime: 15,
            requiresVerification: false,
            dueDate: dueDate.toISOString().split('T')[0],
          });
        });
      }
    }

    // Create tasks in database
    if (tasks.length > 0) {
      const createdTasks = await createStudyTasksBatch(tasks);
      return createdTasks;
    }

    return [];
  } catch (error) {
    console.error('Error generating study tasks:', error);
    return [];
  }
};

/**
 * Generate tasks for today based on what's pending
 */
export const generateTodaysTasks = async (
  userId: string,
  subjectId: string
): Promise<StudyTask[]> => {
  try {
    // Check if tasks already exist for today
    const today = new Date().toISOString().split('T')[0];

    const { data: existingTasks } = await supabase
      .from('study_tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .eq('due_date', today);

    // If tasks exist for today, don't generate new ones
    if (existingTasks && existingTasks.length > 0) {
      return [];
    }

    // Generate new tasks
    return await generateStudyTasksForSubject(userId, subjectId, 1);
  } catch (error) {
    console.error("Error generating today's tasks:", error);
    return [];
  }
};

/**
 * Create a custom study task manually
 */
export const createCustomTask = async (
  userId: string,
  subjectId: string,
  topicId: string | undefined,
  title: string,
  description: string,
  type: 'review' | 'practice' | 'quiz' | 'flashcards' | 'material',
  estimatedTime: number = 30,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<StudyTask | null> => {
  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .insert({
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        title,
        description,
        type,
        priority,
        estimated_time: estimatedTime,
        requires_verification: type === 'material' || type === 'review',
        status: 'pending',
        time_spent: 0,
        due_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating custom task:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      subjectId: data.subject_id,
      topicId: data.topic_id,
      title: data.title,
      description: data.description,
      type: data.type as any,
      priority: data.priority as any,
      estimatedTime: data.estimated_time,
      timeSpent: data.time_spent,
      status: data.status as any,
      completedAt: data.completed_at,
      requiresVerification: data.requires_verification,
      verificationStatus: data.verification_status as any,
      verificationQuizId: data.verification_quiz_id,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating custom task:', error);
    return null;
  }
};

/**
 * Regenerate all tasks for a subject (clears pending tasks and creates new ones)
 */
export const regenerateStudyPlan = async (
  userId: string,
  subjectId: string
): Promise<StudyTask[]> => {
  try {
    // Delete all pending tasks
    await supabase
      .from('study_tasks')
      .delete()
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .eq('status', 'pending');

    // Generate new tasks
    return await generateStudyTasksForSubject(userId, subjectId, 7);
  } catch (error) {
    console.error('Error regenerating study plan:', error);
    return [];
  }
};

/**
 * Get study recommendations based on recent performance
 */
export const getStudyRecommendations = async (
  userId: string,
  subjectId: string
): Promise<{
  focusTopic: string;
  recommendation: string;
  estimatedTime: number;
}> => {
  try {
    const weakTopics = await getWeakTopics(userId, subjectId, 70);

    if (weakTopics.length === 0) {
      return {
        focusTopic: 'All Topics',
        recommendation: 'Great job! Keep reviewing to maintain your mastery.',
        estimatedTime: 30,
      };
    }

    const weakest = weakTopics[0];

    return {
      focusTopic: weakest.topic?.name || 'Focus Area',
      recommendation: `Based on your quiz performance, focus on ${weakest.topic?.name} today. Your mastery improved by ${weakest.trend === 'up' ? 'increasing' : 'needs attention'}. Spend 30-45 minutes reviewing key concepts.`,
      estimatedTime: 35,
    };
  } catch (error) {
    console.error('Error getting study recommendations:', error);
    return {
      focusTopic: 'Study',
      recommendation: 'Continue your learning journey!',
      estimatedTime: 30,
    };
  }
};
