import { supabase } from '@/lib/supabase';
import type { Subject } from '@/types/subject';

// Types for API operations
export interface CreateSubjectDto {
  name: string;
  color: string;
  description?: string;
  testDate?: string;
  teacherEmphasis?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  color?: string;
  description?: string;
  testDate?: string;
  teacherEmphasis?: string;
}

/**
 * Get all subjects for the current user
 */
export async function getSubjects(userId: string): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subjects:', error);
    throw new Error(`Failed to fetch subjects: ${error.message}`);
  }

  return (data || []).map(mapSubjectFromDb);
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(subjectId: string, userId: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching subject:', error);
    throw new Error(`Failed to fetch subject: ${error.message}`);
  }

  return mapSubjectFromDb(data);
}

/**
 * Create a new subject
 */
export async function createSubject(userId: string, dto: CreateSubjectDto): Promise<Subject> {
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      user_id: userId,
      name: dto.name,
      color: dto.color,
      description: dto.description || null,
      test_date: dto.testDate || null,
      teacher_emphasis: dto.teacherEmphasis || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subject:', error);
    throw new Error(`Failed to create subject: ${error.message}`);
  }

  return mapSubjectFromDb(data);
}

/**
 * Update an existing subject
 */
export async function updateSubject(
  subjectId: string,
  userId: string,
  dto: UpdateSubjectDto
): Promise<Subject> {
  const updateData: Record<string, string | null> = {};

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.color !== undefined) updateData.color = dto.color;
  if (dto.description !== undefined) updateData.description = dto.description || null;
  if (dto.testDate !== undefined) updateData.test_date = dto.testDate || null;
  if (dto.teacherEmphasis !== undefined) updateData.teacher_emphasis = dto.teacherEmphasis || null;

  const { data, error } = await supabase
    .from('subjects')
    .update(updateData)
    .eq('id', subjectId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating subject:', error);
    throw new Error(`Failed to update subject: ${error.message}`);
  }

  return mapSubjectFromDb(data);
}

/**
 * Delete a subject
 */
export async function deleteSubject(subjectId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', subjectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting subject:', error);
    throw new Error(`Failed to delete subject: ${error.message}`);
  }
}

/**
 * Get subject statistics (materials count, quizzes count, etc.)
 */
export async function getSubjectStats(subjectId: string, userId: string) {
  // Get materials count
  const { count: materialsCount, error: materialsError } = await supabase
    .from('materials')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId)
    .eq('user_id', userId);

  if (materialsError) {
    console.error('Error fetching materials count:', materialsError);
  }

  // Get quizzes count
  const { count: quizzesCount, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId)
    .eq('user_id', userId);

  if (quizzesError) {
    console.error('Error fetching quizzes count:', quizzesError);
  }

  // Get total study time (from study sessions)
  const { data: studySessions, error: sessionsError } = await supabase
    .from('study_sessions')
    .select('duration')
    .eq('subject_id', subjectId)
    .eq('user_id', userId);

  if (sessionsError) {
    console.error('Error fetching study sessions:', sessionsError);
  }

  const totalMinutes =
    studySessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
  const hoursStudied = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal

  return {
    totalMaterials: materialsCount || 0,
    totalQuizzes: quizzesCount || 0,
    hoursStudied,
  };
}

/**
 * Database row type for subjects table
 */
interface SubjectDbRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  description: string | null;
  test_date: string | null;
  teacher_emphasis: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Helper function to map database fields to TypeScript interface
 */
function mapSubjectFromDb(dbSubject: SubjectDbRow): Subject {
  return {
    id: dbSubject.id,
    userId: dbSubject.user_id,
    name: dbSubject.name,
    color: dbSubject.color,
    description: dbSubject.description || undefined,
    testDate: dbSubject.test_date || undefined,
    teacherEmphasis: dbSubject.teacher_emphasis || undefined,
    createdAt: dbSubject.created_at,
    updatedAt: dbSubject.updated_at,
  };
}
