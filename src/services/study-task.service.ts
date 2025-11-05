import { supabase } from '../lib/supabase';
import type {
  StudyTask,
  StudyTaskDbRow,
  StudyTaskType,
  TaskPriority,
  TaskStatus,
  VerificationStatus,
} from '../types/learning';

// =====================================================
// MAPPING FUNCTIONS
// =====================================================

const mapStudyTaskFromDb = (row: StudyTaskDbRow): StudyTask => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  topicId: row.topic_id || undefined,
  title: row.title,
  description: row.description,
  type: row.type as StudyTaskType,
  priority: row.priority as TaskPriority,
  estimatedTime: row.estimated_time,
  timeSpent: row.time_spent,
  status: row.status as TaskStatus,
  completedAt: row.completed_at || undefined,
  requiresVerification: row.requires_verification,
  verificationStatus: row.verification_status as VerificationStatus | undefined,
  verificationQuizId: row.verification_quiz_id || undefined,
  dueDate: row.due_date || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// =====================================================
// STUDY TASK CRUD OPERATIONS
// =====================================================

/**
 * Get all study tasks for a user
 */
export const getStudyTasks = async (
  userId: string,
  filters?: {
    subjectId?: string;
    status?: TaskStatus;
    dueDate?: string;
  }
): Promise<StudyTask[]> => {
  try {
    let query = supabase
      .from('study_tasks')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId);

    if (filters?.subjectId) {
      query = query.eq('subject_id', filters.subjectId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.dueDate) {
      query = query.lte('due_date', filters.dueDate);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching study tasks:', error);
      return [];
    }

    return (
      data?.map((row: any) => {
        const task = mapStudyTaskFromDb(row);
        if (row.topic) {
          task.topic = {
            id: row.topic.id,
            subjectId: row.topic.subject_id,
            name: row.topic.name,
            description: row.topic.description,
            difficulty: row.topic.difficulty,
            estimatedStudyTime: row.topic.estimated_study_time,
            createdAt: row.topic.created_at,
            updatedAt: row.topic.updated_at,
          };
        }
        return task;
      }) || []
    );
  } catch (error) {
    console.error('Error fetching study tasks:', error);
    return [];
  }
};

/**
 * Get today's study tasks for a user and subject
 */
export const getTodaysTasks = async (userId: string, subjectId: string): Promise<StudyTask[]> => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .in('status', ['pending', 'in-progress'])
      .or(`due_date.lte.${today},due_date.is.null`)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }

    return (
      data?.map((row: any) => {
        const task = mapStudyTaskFromDb(row);
        if (row.topic) {
          task.topic = {
            id: row.topic.id,
            subjectId: row.topic.subject_id,
            name: row.topic.name,
            description: row.topic.description,
            difficulty: row.topic.difficulty,
            estimatedStudyTime: row.topic.estimated_study_time,
            createdAt: row.topic.created_at,
            updatedAt: row.topic.updated_at,
          };
        }
        return task;
      }) || []
    );
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    return [];
  }
};

/**
 * Get a single study task
 */
export const getStudyTask = async (taskId: string): Promise<StudyTask | null> => {
  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching study task:', error);
      return null;
    }

    const task = mapStudyTaskFromDb(data);
    if (data.topic) {
      task.topic = {
        id: data.topic.id,
        subjectId: data.topic.subject_id,
        name: data.topic.name,
        description: data.topic.description,
        difficulty: data.topic.difficulty,
        estimatedStudyTime: data.topic.estimated_study_time,
        createdAt: data.topic.created_at,
        updatedAt: data.topic.updated_at,
      };
    }
    return task;
  } catch (error) {
    console.error('Error fetching study task:', error);
    return null;
  }
};

/**
 * Create a new study task
 */
export const createStudyTask = async (
  task: Omit<StudyTask, 'id' | 'createdAt' | 'updatedAt' | 'timeSpent' | 'status' | 'completedAt'>
): Promise<StudyTask | null> => {
  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .insert({
        user_id: task.userId,
        subject_id: task.subjectId,
        topic_id: task.topicId,
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        estimated_time: task.estimatedTime,
        requires_verification: task.requiresVerification,
        verification_status: task.verificationStatus,
        verification_quiz_id: task.verificationQuizId,
        due_date: task.dueDate,
        status: 'pending',
        time_spent: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating study task:', error);
      return null;
    }

    return data ? mapStudyTaskFromDb(data) : null;
  } catch (error) {
    console.error('Error creating study task:', error);
    return null;
  }
};

/**
 * Update a study task
 */
export const updateStudyTask = async (
  taskId: string,
  updates: Partial<Omit<StudyTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<StudyTask | null> => {
  try {
    const dbUpdates: any = {};

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.estimatedTime !== undefined) dbUpdates.estimated_time = updates.estimatedTime;
    if (updates.timeSpent !== undefined) dbUpdates.time_spent = updates.timeSpent;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
    if (updates.requiresVerification !== undefined)
      dbUpdates.requires_verification = updates.requiresVerification;
    if (updates.verificationStatus !== undefined)
      dbUpdates.verification_status = updates.verificationStatus;
    if (updates.verificationQuizId !== undefined)
      dbUpdates.verification_quiz_id = updates.verificationQuizId;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

    const { data, error } = await supabase
      .from('study_tasks')
      .update(dbUpdates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating study task:', error);
      return null;
    }

    return data ? mapStudyTaskFromDb(data) : null;
  } catch (error) {
    console.error('Error updating study task:', error);
    return null;
  }
};

/**
 * Mark task as completed
 */
export const completeTask = async (
  taskId: string,
  timeSpent?: number
): Promise<StudyTask | null> => {
  const updates: any = {
    status: 'completed',
    completed_at: new Date().toISOString(),
  };

  if (timeSpent !== undefined) {
    updates.time_spent = timeSpent;
  }

  return updateStudyTask(taskId, updates);
};

/**
 * Mark task as in-progress
 */
export const startTask = async (taskId: string): Promise<StudyTask | null> => {
  return updateStudyTask(taskId, { status: 'in-progress' });
};

/**
 * Update task time spent
 */
export const updateTaskTime = async (
  taskId: string,
  timeSpent: number
): Promise<StudyTask | null> => {
  return updateStudyTask(taskId, { timeSpent });
};

/**
 * Update verification status
 */
export const updateVerificationStatus = async (
  taskId: string,
  status: VerificationStatus,
  quizId?: string
): Promise<StudyTask | null> => {
  const updates: any = { verificationStatus: status };

  if (quizId) {
    updates.verificationQuizId = quizId;
  }

  return updateStudyTask(taskId, updates);
};

/**
 * Delete a study task
 */
export const deleteStudyTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('study_tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting study task:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting study task:', error);
    return false;
  }
};

// =====================================================
// BATCH OPERATIONS
// =====================================================

/**
 * Create multiple study tasks at once
 */
export const createStudyTasksBatch = async (
  tasks: Omit<
    StudyTask,
    'id' | 'createdAt' | 'updatedAt' | 'timeSpent' | 'status' | 'completedAt'
  >[]
): Promise<StudyTask[]> => {
  try {
    const taskRecords = tasks.map(task => ({
      user_id: task.userId,
      subject_id: task.subjectId,
      topic_id: task.topicId,
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      estimated_time: task.estimatedTime,
      requires_verification: task.requiresVerification,
      verification_status: task.verificationStatus,
      due_date: task.dueDate,
      status: 'pending',
      time_spent: 0,
    }));

    const { data, error } = await supabase.from('study_tasks').insert(taskRecords).select();

    if (error) {
      console.error('Error creating study tasks batch:', error);
      return [];
    }

    return data?.map(mapStudyTaskFromDb) || [];
  } catch (error) {
    console.error('Error creating study tasks batch:', error);
    return [];
  }
};

/**
 * Get task statistics for a subject
 */
export const getTaskStatistics = async (
  userId: string,
  subjectId: string
): Promise<{
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  completionRate: number;
  averageTimeSpent: number;
  totalTimeSpent: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .select('status, time_spent')
      .eq('user_id', userId)
      .eq('subject_id', subjectId);

    if (error || !data) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        completionRate: 0,
        averageTimeSpent: 0,
        totalTimeSpent: 0,
      };
    }

    const total = data.length;
    const completed = data.filter(t => t.status === 'completed').length;
    const pending = data.filter(t => t.status === 'pending').length;
    const inProgress = data.filter(t => t.status === 'in-progress').length;
    const totalTimeSpent = data.reduce((sum, t) => sum + (t.time_spent || 0), 0);
    const averageTimeSpent = completed > 0 ? totalTimeSpent / completed : 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      completionRate: Math.round(completionRate),
      averageTimeSpent: Math.round(averageTimeSpent),
      totalTimeSpent,
    };
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    return {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      completionRate: 0,
      averageTimeSpent: 0,
      totalTimeSpent: 0,
    };
  }
};
