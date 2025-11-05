import { supabase } from '../lib/supabase';
import type { Topic, TopicMastery, TopicDbRow, TopicMasteryDbRow } from '../types/learning';

// =====================================================
// MAPPING FUNCTIONS
// =====================================================

const mapTopicFromDb = (row: TopicDbRow): Topic => ({
  id: row.id,
  subjectId: row.subject_id,
  name: row.name,
  description: row.description || undefined,
  difficulty: row.difficulty as 'beginner' | 'intermediate' | 'advanced',
  estimatedStudyTime: row.estimated_study_time,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTopicMasteryFromDb = (row: TopicMasteryDbRow): TopicMastery => ({
  id: row.id,
  userId: row.user_id,
  topicId: row.topic_id,
  subjectId: row.subject_id,
  masteryLevel: parseFloat(row.mastery_level.toString()),
  totalQuizzesTaken: row.total_quizzes_taken,
  quizzesPassed: row.quizzes_passed,
  averageQuizScore: parseFloat(row.average_quiz_score.toString()),
  lastQuizScore: row.last_quiz_score ? parseFloat(row.last_quiz_score.toString()) : undefined,
  trend: row.trend as 'up' | 'down' | 'stable' | 'unknown',
  lastStudiedAt: row.last_studied_at || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// =====================================================
// TOPIC CRUD OPERATIONS
// =====================================================

/**
 * Get all topics for a subject
 */
export const getTopicsBySubject = async (subjectId: string): Promise<Topic[]> => {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('subject_id', subjectId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching topics:', error);
      return [];
    }

    return data?.map(mapTopicFromDb) || [];
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

/**
 * Get a single topic by ID
 */
export const getTopic = async (topicId: string): Promise<Topic | null> => {
  try {
    const { data, error } = await supabase.from('topics').select('*').eq('id', topicId).single();

    if (error) {
      console.error('Error fetching topic:', error);
      return null;
    }

    return data ? mapTopicFromDb(data) : null;
  } catch (error) {
    console.error('Error fetching topic:', error);
    return null;
  }
};

/**
 * Create a new topic
 */
export const createTopic = async (
  subjectId: string,
  name: string,
  description?: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'medium',
  estimatedStudyTime: number = 30
): Promise<Topic | null> => {
  try {
    const { data, error } = await supabase
      .from('topics')
      .insert({
        subject_id: subjectId,
        name,
        description,
        difficulty,
        estimated_study_time: estimatedStudyTime,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating topic:', error);
      return null;
    }

    return data ? mapTopicFromDb(data) : null;
  } catch (error) {
    console.error('Error creating topic:', error);
    return null;
  }
};

/**
 * Update a topic
 */
export const updateTopic = async (
  topicId: string,
  updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Topic | null> => {
  try {
    const dbUpdates: any = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.estimatedStudyTime !== undefined)
      dbUpdates.estimated_study_time = updates.estimatedStudyTime;

    const { data, error } = await supabase
      .from('topics')
      .update(dbUpdates)
      .eq('id', topicId)
      .select()
      .single();

    if (error) {
      console.error('Error updating topic:', error);
      return null;
    }

    return data ? mapTopicFromDb(data) : null;
  } catch (error) {
    console.error('Error updating topic:', error);
    return null;
  }
};

/**
 * Delete a topic
 */
export const deleteTopic = async (topicId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('topics').delete().eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting topic:', error);
    return false;
  }
};

// =====================================================
// TOPIC MASTERY OPERATIONS
// =====================================================

/**
 * Get user's mastery for all topics in a subject
 */
export const getTopicMasteryBySubject = async (
  userId: string,
  subjectId: string
): Promise<TopicMastery[]> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .order('mastery_level', { ascending: false });

    if (error) {
      console.error('Error fetching topic mastery:', error);
      return [];
    }

    return (
      data?.map((row: any) => {
        const mastery = mapTopicMasteryFromDb(row);
        if (row.topic) {
          mastery.topic = mapTopicFromDb(row.topic);
        }
        return mastery;
      }) || []
    );
  } catch (error) {
    console.error('Error fetching topic mastery:', error);
    return [];
  }
};

/**
 * Get user's mastery for a specific topic
 */
export const getTopicMastery = async (
  userId: string,
  topicId: string
): Promise<TopicMastery | null> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (error) {
      // If no mastery record exists, return null (not an error)
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching topic mastery:', error);
      return null;
    }

    const mastery = mapTopicMasteryFromDb(data);
    if (data.topic) {
      mastery.topic = mapTopicFromDb(data.topic);
    }
    return mastery;
  } catch (error) {
    console.error('Error fetching topic mastery:', error);
    return null;
  }
};

/**
 * Get weak topics (mastery < 70%)
 */
export const getWeakTopics = async (
  userId: string,
  subjectId: string,
  threshold: number = 70
): Promise<TopicMastery[]> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .lt('mastery_level', threshold)
      .order('mastery_level', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching weak topics:', error);
      return [];
    }

    return (
      data?.map((row: any) => {
        const mastery = mapTopicMasteryFromDb(row);
        if (row.topic) {
          mastery.topic = mapTopicFromDb(row.topic);
        }
        return mastery;
      }) || []
    );
  } catch (error) {
    console.error('Error fetching weak topics:', error);
    return [];
  }
};

/**
 * Get strong topics (mastery >= 80%)
 */
export const getStrongTopics = async (
  userId: string,
  subjectId: string,
  threshold: number = 80
): Promise<TopicMastery[]> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select(
        `
        *,
        topic:topics(*)
      `
      )
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .gte('mastery_level', threshold)
      .order('mastery_level', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching strong topics:', error);
      return [];
    }

    return (
      data?.map((row: any) => {
        const mastery = mapTopicMasteryFromDb(row);
        if (row.topic) {
          mastery.topic = mapTopicFromDb(row.topic);
        }
        return mastery;
      }) || []
    );
  } catch (error) {
    console.error('Error fetching strong topics:', error);
    return [];
  }
};

/**
 * Initialize topic mastery for a user
 * Call this when a user first encounters a topic
 */
export const initializeTopicMastery = async (
  userId: string,
  topicId: string,
  subjectId: string
): Promise<TopicMastery | null> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .insert({
        user_id: userId,
        topic_id: topicId,
        subject_id: subjectId,
        mastery_level: 0,
        total_quizzes_taken: 0,
        quizzes_passed: 0,
        average_quiz_score: 0,
        trend: 'unknown',
      })
      .select()
      .single();

    if (error) {
      // If already exists, that's okay
      if (error.code === '23505') {
        return await getTopicMastery(userId, topicId);
      }
      console.error('Error initializing topic mastery:', error);
      return null;
    }

    return data ? mapTopicMasteryFromDb(data) : null;
  } catch (error) {
    console.error('Error initializing topic mastery:', error);
    return null;
  }
};

/**
 * Calculate overall subject mastery from topic mastery
 */
export const calculateSubjectMastery = async (
  userId: string,
  subjectId: string
): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('topic_mastery')
      .select('mastery_level')
      .eq('user_id', userId)
      .eq('subject_id', subjectId);

    if (error || !data || data.length === 0) {
      return 0;
    }

    // Calculate average mastery across all topics
    const totalMastery = data.reduce(
      (sum, row) => sum + parseFloat(row.mastery_level.toString()),
      0
    );

    return Math.round(totalMastery / data.length);
  } catch (error) {
    console.error('Error calculating subject mastery:', error);
    return 0;
  }
};
